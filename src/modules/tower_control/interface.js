const Vec2 = require("./vec2");
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
}

class PlaneManager
{
	getPlane(id)
	{
		// Stub. TODO: fetch actual data from plane manager

		return Promise.resolve(new Plane(this, 0, new Vec2(0.0), 0.0));
	};

	updatePlane(plane)
	{
		// Stub. TODO: fetch actual data from plane manager
	}

	setDestination(plane, pos)
	{
		// Stub. TODO: send actual destination to plane manager
	}

	setOperator(operatorName)
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