const Vec3 = require("../util/vec3");
const Plane = require("../module/plane");
const EventEmitter = require("events").EventEmitter;



class PlaneManager
{
	constructor(host)
	{
		this.host = host;
	}

	async getPlane(id)
	{
		const plane = new Plane(this, id, null, 0);
		await plane.update();
		return plane;
	}

	async getPlaneData(id)
	{
		const data = await fetch(this.host + "/position?" + new URLSearchParams({ plane_id: id }));
		const json = await data.json(); // TODO: check speed and dest?
		return json;
	};

	async updatePlane(plane)
	{
		const data = await this.getPlaneData(plane.id);
		plane.pos = new Vec3(data.x, data.y, data.z);
		plane.speed = data.speed;

		if(data.destX)
		{
			plane.dest = new Vec3(data.destX, data.destY, data.destZ);
		}
	}

	setPlaneDestination(plane, pos)
	{
		pos = pos.copy();
		pos.plane_id = plane.id;

		fetch(this.host + "/destination", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(pos)
		});
	}

	setPlaneOperator(plane, operatorName)
	{
		fetch(this.host + "/transfer", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ plane_id: plane.id, operator: operatorName })
		});
	}
}

class ApproachControl extends EventEmitter
{
	constructor(host)
	{
		super();
		this.host = host;
	}

	requestTransfer(plane)
	{
		// Stub. TODO: request actual plane transfer

		return Promise.resolve({ ready: true });
	}
}

class GroundControl
{
	constructor(host)
	{
		this.host = host;
	}

	isStripFree()
	{
		// Stub. TODO: request actual strip status from ground control

		return Promise.resolve({ ok: true });
	}
}

class AirportService
{
	constructor(host)
	{
		this.host = host;
	}

	getStripStatus()
	{
		// Stub. TODO: request actual strip status from airport service

		return Promise.resolve({ ok: true });
	}
}

class InformationBoard
{
	constructor(host)
	{
		this.host = host;
	}

	notifyPlaneStatus(plane)
	{
		// Stub. TODO: actually notify the information board
	}
}

class ModuleInterface
{
	constructor(modulesConfig)
	{
		this._messageHandlers = new Map();

		const addModule = (cfg, factory) =>
		{
			const module = factory(cfg.host);
			this._messageHandlers.set(cfg.name, module);
			return module;
		}

		this.planeManager = addModule(modulesConfig.planeManager, host => new PlaneManager(host));
		this.approachControl = addModule(modulesConfig.approachControl, host => new ApproachControl(host));
		this.groundControl = addModule(modulesConfig.groundControl, host => new GroundControl(host));
		this.airportService = addModule(modulesConfig.airportService, host => new AirportService(host));
		this.informationBoard = addModule(modulesConfig.informationBoard, host => new InformationBoard(host));
	}

	handleMessage(content, from)
	{
		console.log("Received message:", content, "from:", from);
		// this._messageHandlers.get(from).handle(content);
	}
}

class MockableInterface extends ModuleInterface
{
	constructor(modulesConfig)
	{
		super(modulesConfig);
	}

	mock(towerController)
	{
		this._allPlanes = new Map();
		this._towerController = towerController;
		this._setup();
	}

	_toData(plane)
	{
		return {
			id: plane.id,
			x: plane.pos.x,
			y: plane.pos.y,
			z: plane.pos.z,
			speed: plane.speed,
			destX: plane.dest.x,
			destY: plane.dest.y,
			destZ: plane.dest.z
		}
	}

	// Returns a random number between min (inclusive) and max (exclusive)
	_getRandom(min, max)
	{
		return Math.random() * (max - min) + min;
	}

	// Returns a random integer between min (inclusive) and max (inclusive).
	_getRandomInt(min, max)
	{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	_getRandomBool()
	{
		return Math.random() < 0.5;
	}

	/*=============================*/

	_getPlaneData(id)
	{
		if(this._allPlanes.has(id))
		{
			return Promise.resolve( this._toData( this._allPlanes.get(id) ) );
		}

		return Promise.reject();
	}

	_setPlaneDestination(plane, pos)
	{
		const ourPlane = this._allPlanes.get(plane.id);
	
		if(ourPlane)
		{
			ourPlane.dest = pos.copy();
			return Promise.resolve();
		}

		return Promise.reject();
	}

	_updatePlanes()
	{
		for(const plane of this._allPlanes.values())
		{
			const move = plane.dest.copy().sub(plane.pos).normalize().mul(plane.speed * this._towerController._timePerTick / 1000.0);
			plane.pos.add(move);
		}
	}

	_spawnRandomPlane()
	{
		const id = this._getRandomInt(-1000, 1000);

		if(this._allPlanes.has(id))
		{
			return;
		}

		const w = this._towerController.circuit.width;
		const h = this._towerController.circuit.height;
		const l = this._towerController.circuit.length;

		const lowBound = 2.0;
		const upBound = 2.5;

		const x = this._getRandom(-w * upBound / 2.0, w * upBound / 2.0);
		const y = this._getRandom(h, h * 2);
		let z = 0.0;

		if(x > -w * lowBound / 2.0 && x <= w * lowBound / 2.0)
		{
			if(this._getRandomBool())
			{
				z = this._getRandom(l * lowBound / 2.0, l * upBound / 2.0);
			}
			else
			{
				z = this._getRandom(-l * upBound / 2.0, -l * lowBound / 2.0);
			}
		}
		else
		{
			z = this._getRandom(-l * upBound / 2.0, l * upBound / 2.0);
		}

		const speed = 70.0;

		const plane = new Plane(this.planeManager, id, new Vec3(x, y, z), speed);
		plane.dest = new Vec3(0.0, plane.pos.y, 0.0);

		this._allPlanes.set(plane.id, plane);

		this.approachControl.emit("transfer_plane", plane.id);
	}

	_setup()
	{
		this.planeManager.getPlaneData = this._getPlaneData.bind(this);
		this.planeManager.setPlaneDestination = this._setPlaneDestination.bind(this);

		setInterval(this._updatePlanes.bind(this), this._towerController._timePerTick);
		// setInterval(this._spawnRandomPlane.bind(this), 1 * 1000);
	}
}

module.exports = MockableInterface;