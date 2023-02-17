const TowerController = require("./tower_controller");
const ModuleInterface = require("./module_interface");
const Tester = require("./tester");



const towerController = new TowerController(10);

const planeManager = new ModuleInterface.PlaneManager();
const approachControl = new ModuleInterface.ApproachControl();
const groundControl = new ModuleInterface.GroundControl();
const airportService = new ModuleInterface.AirportService();
const informationBoard = new ModuleInterface.InformationBoard();

towerController.start();

approachControl.addListener("transfer_plane", async id =>
{
	const plane = new ModuleInterface.Plane(planeManager, id, null, 0);
	await plane.update();
	towerController.addPlane(plane);
});

Tester.setup(towerController, planeManager, approachControl);

module.exports = {
	towerController
};