const Vec2 = require("./vec2");
const ModuleInterface = require("./module_interface");
const TrafficCircuit = require("./traffic_circuit");

module.exports = class TowerController
{
	constructor(tps)
	{
		this.circuit = new TrafficCircuit(new Vec2(0.0), 1000.0, 400.0, 200.0);

		this._timePerTick = 1000 / tps;
		this._interval = null;
	}

	start()
	{
		this._interval = setInterval(this.loop.bind(this), this._timePerTick);
	}

	stop()
	{
		clearInterval(this._interval);
	}

	loop()
	{
		for(const echelon of this.circuit.planeEchelons)
		{
			for(const plane of echelon)
			{
				plane.update();
			}
		}

		this.circuit.updateDestinations();
	}

	addPlane(plane)
	{
		const targetData = this.circuit.alignPlane(plane);

		if(!targetData)
		{
			// TODO: refuse plane (send back to approach control?)
			return;
		}

		console.log("ADDED", targetData);

		plane.setDestination(targetData[0], true);
		this.circuit.addPlaneToEchelon(plane, targetData[1]);
	}
}