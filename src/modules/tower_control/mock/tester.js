const Vec3 = require("../util/vec3");
const Plane = require("../module/plane");



// Returns a random number between min (inclusive) and max (exclusive)
function getRandom(min, max)
{
	return Math.random() * (max - min) + min;
}

// Returns a random integer between min (inclusive) and max (inclusive).
function getRandomInt(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



function toData(plane)
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



function setup(towerController, interface)
{
	const allPlanes = new Map();

	interface.planeManager.getPlaneData = id =>
	{
		if(allPlanes.has(id))
		{
			return Promise.resolve( toData( allPlanes.get(id) ) );
		}

		return Promise.reject();
	};

	interface.planeManager.setPlaneDestination = (plane, pos) =>
	{
		const ourPlane = allPlanes.get(plane.id);

		if(ourPlane)
		{
			ourPlane.dest = pos.copy();
			return Promise.resolve();
		}

		return Promise.reject();
	};

	setInterval(() =>
	{
		for(const plane of allPlanes.values())
		{
			const move = plane.dest.copy().sub(plane.pos).normalize().mul(plane.speed * towerController._timePerTick / 1000.0);
			plane.pos.add(move);
		}

	}, towerController._timePerTick);

	setInterval(() =>
	{
		const id = getRandomInt(-1000, 1000);

		if(allPlanes.has(id))
		{
			return;
		}

		const plane = new Plane(
			interface.planeManager,
			id,
			new Vec3(
				getRandom(-towerController.circuit.width / 2, towerController.circuit.width / 2),
				getRandom(towerController.circuit.height, towerController.circuit.height * 2),
				getRandom(towerController.circuit.length * 1.5, towerController.circuit.length * 2)),
			getRandom(10.0, 50.0));
		plane.dest = new Vec3(0.0, plane.pos.y, 0.0);

		allPlanes.set(plane.id, plane);

		interface.approachControl.emit("transfer_plane", plane.id);

	}, 3 * 1000);
}



module.exports = {
	setup
};