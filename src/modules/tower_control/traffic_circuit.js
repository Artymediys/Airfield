const Vec2 = require("./vec2");

module.exports = class TrafficCircuit
{
	constructor(center, width, height)
	{
		this.center = center;
		this.width = width;
		this.height = height;

		const corner = new Vec2(width, height).div(2.0);
		this._cornerTR = corner.copy().add(center);
		this._cornerTL = corner.copy().mul(-1.0, 1.0).add(center);
		this._cornerBL = corner.copy().mul(-1.0).add(center);
		this._cornerBR = corner.copy().mul(1.0, -1.0).add(center);

		this._clockwise = false;

		this._triggerRadius = 50.0;
		this._safetyRadius = 150.0;

		this.planes = [];
	}

	// A - top right diagonal
	// B - bottom right diagonal
	_getClosestLine(interposA, interposB)
	{
		// on A
		if(interposA === 0)
		{
			// above B
			if(interposB < 0)
			{
				return [ this._cornerTR.copy() ];
			}

			// under B
			return [ this._cornerBL.copy() ];
		}

		// on B
		if(interposB === 0)
		{
			// under A
			if(interposA > 0)
			{
				return [ this._cornerBR.copy() ];
			}

			//above A
			return [ this._cornerTL.copy() ]
		}

		// under A
		if(interposA > 0)
		{
			// under B
			if(interposB > 0)
			{
				return [ this._cornerBL.copy(), this._cornerBR.copy() ];
			}

			// above B
			return [ this._cornerBR.copy(), this._cornerTR.copy() ];
		}

		// above A

		// above B
		if(interposB < 0)
		{
			return [ this._cornerTR.copy(), this._cornerTL.copy() ];
		}

		// under B
		return [ this._cornerTL.copy(), this._cornerBL.copy() ];
	}

	_getClosestCorner(points)
	{
		return points[this._clockwise ? 0 : points.length - 1];
	}

	_simulatePlane(plane, time)
	{
		return null; // TODO
	}

	_areTooClose(pos1, pos2)
	{
		return pos1.copy().sub(pos2).length() < this._safetyRadius;
	}

	align(plane)
	{
		const interposA = plane.pos.interpos(this.center, new Vec2(this.width, this.height));
		const interposB = plane.pos.interpos(this.center, new Vec2(this.width, -this.height));

		const line = this._getClosestLine(interposA, interposB);
		const projectedPoint = line.length === 1 ? line[0] : plane.pos.projectClamped(...line);
		const corner = this._getClosestCorner(line);

		const target = projectedPoint.copy().add(corner).div(2.0);

		const dist = plane.pos.copy().sub(target).length();
		const time = dist / plane.speed;

		for(const alignedPlane in this.planes)
		{
			const simulatedPos = this._simulatePlane(alignedPlane, time);

			if(this._areTooClose(target, simulatedPos))
			{
				return; // TODO: try more points or try higher echelon
			}
		}

		// TODO: send dest to plane
	}
}