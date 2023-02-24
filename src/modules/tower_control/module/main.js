const TowerController = require("./tower_controller");
const ModuleInterface = require("../comm/module_interface");
const MQClient = require("../comm/mq_client");
const Tester = require("../mock/tester");



const Config = require("../config.json");



const towerController = new TowerController(10);



async function run(mock)
{
	const interface = new ModuleInterface();
	interface.approachControl.on("transfer_plane", async id => towerController.addPlane(await interface.planeManager.getPlane(id)));



	const client = new MQClient();
	await client.connect(Config.connection);
	await client.setup(Config.exchange, Config.queue.name);

	client.on("message", (content, from) => interface.handleMessage.bind(interface));

	//process.on("SIGINT", client.close.bind(client));
	//process.on("SIGTERM", client.close.bind(client));



	towerController.start();
	
	if(mock)
	{
		Tester.setup(towerController, interface);
	}

	console.log("Started");
}



run(process.argv[2] === "-t");



module.exports = {
	towerController
};