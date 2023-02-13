const Vec3 = require("./vec3");
const ModuleInterface = require("./module_interface");

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

function setup(planeManager, approachControl)
{
	const allPlanes = new Map();

	planeManager.getPlane = id =>
	{
		if(allPlanes.has(id))
		{
			return Promise.resolve(allPlanes.get(id));
		}

		return Promise.reject();
	}

	setInterval(() =>
	{
		const plane = new ModuleInterface.Plane(planeManager, getRandomInt(0, 10000), new Vec3(getRandom(-500.0, 500.0), getRandom(400.0, 700.0), getRandom(300.0, 600.0)), getRandom(30.0, 70.0));
		allPlanes.set(plane.id, plane);
		approachControl.emit("transfer_plane", plane.id);
	}, 3 * 1000);
}

module.exports = {
	setup
};