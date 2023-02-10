const TowerController = require("./tower_controller");
const ModuleInterface = require("./interface");
const Tester = require("./tester");



const towerController = new TowerController();

const planeManager = new ModuleInterface.PlaneManager();
const approachControl = new ModuleInterface.ApproachControl();
const groundControl = new ModuleInterface.GroundControl();
const airportService = new ModuleInterface.AirportService();
const informationBoard = new ModuleInterface.InformationBoard();

approachControl.addListener("transfer_plane", id => {
	planeManager.getPlane(id).then(console.log);
});

Tester.setup(planeManager, approachControl);