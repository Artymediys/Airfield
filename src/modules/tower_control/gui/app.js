const Gui = require("gui");
const Main = require("../module/main");



/* ==================== */

function getColorForPlane(plane)
{
	if(plane.pos.y <= 250)
	{
		return "#ff0000";
	}
	if(plane.pos.y <= 450)
	{
		return "#ff8400";
	}
	if(plane.pos.y < 650)
	{
		return "#ffe100";
	}

	return "#ff00aa";
}

function renderPlane(painter, plane)
{
	painter.setFillColor(getColorForPlane(plane));
	painter.beginPath();
	painter.arc(plane.pos.horizontal(), 10, 0, 2 * Math.PI);
	painter.fill();

	painter.setStrokeColor("#8000e000");
	painter.beginPath();
	painter.moveTo(plane.pos.horizontal());
	painter.lineTo(plane.dest.horizontal());
	painter.stroke();
}

function render(self, painter)
{
	const size = win.getContentSize();

	const center = { x: size.width / 2, y: size.height / 2 };
	const scale = 0.5;

	painter.setFillColor("#0000e0");
	painter.setStrokeColor("#0000e0");

	painter.scale({ x: scale, y: scale });
	painter.translate(center);

	painter.beginPath();

	for(let i = 0; i < 4; ++i)
	{
		painter.moveTo(Main.towerController.circuit._getCornerByIdx(i));
		painter.lineTo(Main.towerController.circuit._getCornerByIdx(i + 1));
	}

	painter.stroke();

	for(const echelon of Main.towerController.circuit.planeEchelons)
	{
		for(const plane of echelon)
		{
			renderPlane(painter, plane);
		}
	}
}

/* ==================== */

function setupWindow()
{
	const win = Gui.Window.create({});
	win.setContentSize({ width: 800, height: 600 });
	win.setResizable(false);
	win.onClose = () =>
	{
		Gui.MessageLoop.quit();
		process.exit(0);
	};
	win.activate();
	return win;
}

function setupView(window, fps)
{
	const view = Gui.Container.create();
	view.setMouseDownCanMoveWindow(true);
	view.onDraw = render;
	window.setContentView(view);
	setInterval(() => view.schedulePaint(), 1000 / fps);
	return view;
}



/* ==================== */

const win = setupWindow();
const view = setupView(win, 40);
global.mainWindow = win;



if (!process.versions.yode && !process.versions.electron)
{
	Gui.MessageLoop.run();
	process.exit(0);
}
