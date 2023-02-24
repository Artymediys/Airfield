const Vec3 = require("../util/vec3");
const Plane = require("../module/plane");
const EventEmitter = require("events").EventEmitter;



class PlaneManager
{
	async getPlane(id)
	{
		const plane = new Plane(this, id, null, 0);
		await plane.update();
		return plane;
	}

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

module.exports = class ModuleInterface
{
	constructor()
	{
		this._messageHandlers = new Map();

		const addModule = (name, module) =>
		{
			this._messageHandlers.set(name, module);
			return module;
		}

		this.planeManager = addModule("Board", new PlaneManager());
		this.approachControl = addModule("Approach Control", new ApproachControl());
		this.groundControl = addModule("Ground Control", new GroundControl());
		this.airportService = addModule("Airport Service", new AirportService());
		this.informationBoard = addModule("Information Board", new InformationBoard());
	}

	handleMessage(content, from)
	{
		// TODO: stuff
	}
}