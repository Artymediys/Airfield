const Vec3 = require("./vec3");
const EventEmitter = require("events").EventEmitter;

class Plane
{
	constructor(manager, id, pos, speed)
	{
		this._manager = manager;

		this.id = id;
		this.pos = pos;
		this.speed = speed;
	}

	copy()
	{
		const planeCopy = new Plane(this._manager, this.id, this.pos.copy(), this.speed);
		
		if(this.dest)
		{
			planeCopy.dest = this.dest.copy();
		}

		return planeCopy;
	}

	async update()
	{
		return this._manager.updatePlane(this);
	}

	setDestination(pos, notify)
	{
		this.dest = pos;

		if(notify)
		{
			this._manager.setPlaneDestination(this, pos);
		}
	}

	setOperator(operatorName)
	{
		this._manager.setPlaneOperator(this, operatorName);
	}
}

class PlaneManager
{
	getPlaneData(id)
	{
		// Stub. TODO: fetch actual data from plane manager

		return Promise.resolve({ x: 0, y: 0, z: 0, speed: 0, destX: 0, destY: 0, destZ: 0 });
	};

	async updatePlane(plane)
	{
		const data = await this.getPlaneData(plane.id);
		plane.pos = new Vec3(data.x, data.y, data.z);
		plane.speed = data.speed;
		plane.dest = new Vec3(data.destX, data.destY, data.destZ);
	}

	setPlaneDestination(plane, pos)
	{
		// Stub. TODO: send actual destination to plane manager
	}

	setPlaneOperator(plane, operatorName)
	{
		// Stub. TODO: send actual operator to plane manager
	}
}

class ApproachControl extends EventEmitter
{
	requestTransfer(plane)
	{
		// Stub. TODO: request actual plane transfer

		return Promise.resolve({ ready: true });
	}
}

class GroundControl
{
	isStripFree()
	{
		// Stub. TODO: request actual strip status from ground control

		return Promise.resolve({ ok: true });
	}
}

class AirportService
{
	getStripStatus()
	{
		// Stub. TODO: request actual strip status from airport service

		return Promise.resolve({ ok: true });
	}
}

class InformationBoard
{
	notifyPlaneStatus(plane)
	{
		// Stub. TODO: actually notify the information board
	}
}

module.exports = {
	Plane,
	PlaneManager,
	ApproachControl,
	GroundControl,
	AirportService,
	InformationBoard
}