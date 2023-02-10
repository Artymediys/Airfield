const Vec2 = require("./vec2");
const ModuleInterface = require("./interface");
const TrafficCircuit = require("./traffic_circuit");

module.exports = class TowerController
{
	constructor()
	{
		this.circuit = new TrafficCircuit(new Vec2(0.0), 1000.0, 400.0);

		this.approachingPlanes = [];
	}

	loop()
	{
		for(const plane in this.approachingPlanes.slice().concat(this.circuit.planes))
		{
			plane.updatePlaneState();
		}
	}
}