const Vec2 = require("../util/vec2");
const Plane = require("./plane");

module.exports = class TrafficCircuit
{
	constructor(center, width, length, height)
	{
		this.center = center;
		this.width = width;
		this.length = length;
		this.height = height;

		const corner = new Vec2(width, length).div(2.0);
		// TR, TL, BL, BR
		this._corners = [ corner.copy().add(center), corner.copy().mul(-1.0, 1.0).add(center), corner.copy().mul(-1.0).add(center), corner.copy().mul(1.0, -1.0).add(center) ];

		this._clockwise = false;

		this._triggerRadius = 20.0;
		this._safetyRadius = 50.0;

		this.planeEchelons = [ [], [], [], [] ];
	}
	
	_getEchelonHeightByIdx(idx)
	{
		return (+idx + 1) * this.height;
	}

	_getCornerByIdx(idx)
	{
		return this._corners[idx % this._corners.length].copy();
	}

	_getNextCornerByIdx(idx)
	{
		return this._getCornerByIdx(idx + (this._clockwise ? -1 : 1));
	}

	_getQuarterForPlane(plane)
	{
		return [ this._corners[0], this._corners[3] ].map(corner => plane.pos.horizontal().interpos(this.center, corner));
	}

	// A - top right diagonal
	// B - bottom right diagonal
	_getClosestLineIndices(interposA, interposB)
	{
		// on A
		if(interposA === 0)
		{
			// above B
			if(interposB < 0)
			{
				return [ 0 ]; // TR
			}

			// under B
			return [ 2 ]; // BL
		}

		// on B
		if(interposB === 0)
		{
			// under A
			if(interposA > 0)
			{
				return [ 3 ]; // BR
			}

			//above A
			return [ 1 ]; // TL
		}

		// under A
		if(interposA > 0)
		{
			// under B
			if(interposB > 0)
			{
				return [ 2, 3 ]; // BL BR
			}

			// above B
			return [ 3, 0 ]; // BR TR
		}

		// above A

		// above B
		if(interposB < 0)
		{
			return [ 0, 1 ]; // TR TL
		}

		// under B
		return [ 1, 2 ]; // TL BL
	}

	_getCornerIdxBasedOnDirection(points)
	{
		return points[this._clockwise ? 0 : points.length - 1];
	}

	_simulatePlane(plane, time, echelonIdx)
	{
		const planeCopy = plane.copy();

		let distToTravel = planeCopy.dest.copy().sub(planeCopy.pos).length();
		let distWouldTravel = planeCopy.speed * time;

		while(distWouldTravel > distToTravel)
		{
			distWouldTravel -= distToTravel;
			planeCopy.pos = planeCopy.dest.copy();
			this._updatePlaneDestination(planeCopy, echelonIdx, true);
			distToTravel = planeCopy.dest.copy().sub(planeCopy.pos).length();
		}

		planeCopy.pos.add(planeCopy.dest.copy().sub(planeCopy.pos).normalize().mul(distWouldTravel));

		return planeCopy.pos;
	}

	_areTooClose(pos1, pos2)
	{
		return pos1.copy().sub(pos2).length() < this._safetyRadius;
	}

	_isPlaneInTarget(plane)
	{
		return plane.pos.copy().sub(plane.dest).length() < this._triggerRadius;
	}

	_canEnterEchelon(target, time, idx) // TODO: account for planes that are not in the ring but approaching it
	{
		for(const alignedPlane of this.planeEchelons[idx])
		{
			const simulatedPos = this._simulatePlane(alignedPlane, time, idx);

			if(this._areTooClose(target, simulatedPos))
			{
				return false;
			}
		}

		return true;
	}

	alignPlane(plane)
	{
		const quarter = this._getQuarterForPlane(plane);
		const line = this._getClosestLineIndices(...quarter);
		const corner = this._getCornerByIdx(this._getCornerIdxBasedOnDirection(line));

		const projectedPoint = line.length === 1 ? this._getCornerByIdx(line[0]) : plane.pos.horizontal().projectClamped(...line.map(i => this._getCornerByIdx(i)));

		for(let i = 0; i < this.planeEchelons.length; ++i) // TODO: pick closest echelon by Y first
		{
			const target = projectedPoint.copy().add(corner).div(2.0).withY(this._getEchelonHeightByIdx(i));

			const dist = plane.pos.copy().sub(target).length();
			const time = dist / plane.speed;

			if(this._canEnterEchelon(target, time, i))
			{
				return [ target, i ];
			}
		}

		return null;
	}

	addPlaneToEchelon(plane, echelonIdx)
	{
		this.planeEchelons[echelonIdx].push(plane);
	}

	_updatePlaneDestination(plane, echelonIdx, simulate)
	{
		if(!this._isPlaneInTarget(plane))
		{
			return;
		}

		const quarter = this._getQuarterForPlane(plane);
		const line = this._getClosestLineIndices(...quarter);
		const cornerIdx = this._getCornerIdxBasedOnDirection(line);
		const corner = this._getCornerByIdx(cornerIdx);

		// plane joined circuit (reached intermediate dest)
		let dest = corner;

		const echelonHeight = this._getEchelonHeightByIdx(echelonIdx);

		// plane reached corner dest
		if(plane.dest.fuzzyEquals(corner.withY(echelonHeight), 0.1))
		{
			dest = this._getNextCornerByIdx(cornerIdx);
		}

		plane.setDestination(dest.withY(echelonHeight), !simulate);
	}

	updateDestinations()
	{
		for(let i = 0; i < this.planeEchelons.length; ++i)
		{
			for(const plane of this.planeEchelons[i])
			{
				this._updatePlaneDestination(plane, i, false);
			}
		}
	}
}