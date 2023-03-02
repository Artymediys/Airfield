const TowerController = require("./tower_controller");
const ModuleInterface = require("../comm/module_interface");
const MQClient = require("../comm/mq_client");



const Config = require("../config.json");



const towerController = new TowerController(30);
const moduleInterface = new ModuleInterface(Config.modules);



async function run(mock)
{
	moduleInterface.approachControl.on("transfer_plane", async id => towerController.addPlane(await moduleInterface.planeManager.getPlane(id)));



	if(mock)
	{
		moduleInterface.mock(towerController);
	}
	else
	{
		const client = new MQClient();
		await client.connect(Config.mq.connection);
		await client.setup(Config.mq.exchange, Config.mq.queue.name);

		client.on("message", (content, from) => moduleInterface.handleMessage(content, from));

		client.send("Visualizer", "Tower Control");



		/*
		const app = Express();

		app.get("/", (req, res) =>
		{
			res.send("Hello World!")
		});

		app.listen(port, () =>
		{
			console.log(`Server listening on port ${port}`);
		});
		*/
	}

	//process.on("SIGINT", client.close.bind(client));
	//process.on("SIGTERM", client.close.bind(client));



	towerController.start();

	console.log("Started");
}



run(process.argv[2] === "-t");



module.exports = {
	towerController,
	moduleInterface
};