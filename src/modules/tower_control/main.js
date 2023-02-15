const TowerController = require("./tower_controller");
const ModuleInterface = require("./module_interface");
const Tester = require("./tester");



const towerController = new TowerController();

const planeManager = new ModuleInterface.PlaneManager();
const approachControl = new ModuleInterface.ApproachControl();
const groundControl = new ModuleInterface.GroundControl();
const airportService = new ModuleInterface.AirportService();
const informationBoard = new ModuleInterface.InformationBoard();

const Vec3 = require("./vec3");

const plane = new ModuleInterface.Plane(planeManager, 0, new Vec3(-500, 200, -200), 10);
plane.dest = new Vec3(500, 200, -200);

towerController.circuit.planeEchelons[0].push(plane);

console.log(towerController.circuit._canEnterEchelon(new Vec3(-349, 200, -200), 10, 0));

/*
approachControl.addListener("transfer_plane", id => {
	planeManager.getPlane(id).then(console.log);
});
*/

Tester.setup(planeManager, approachControl);