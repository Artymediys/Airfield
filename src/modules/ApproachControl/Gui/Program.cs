using ApproachControl;

namespace Gui
{
	internal static class Program
	{
		/// <summary>
		///  The main entry point for the application.
		/// </summary>
		[STAThread]
		static void Main()
		{
			ApplicationConfiguration.Initialize();

			List<Board> planesList = new List<Board>();

			// Добавление элементов в список
			planesList.Add(new Board { plane_id = "001", x = 10f, y = 20f, z = 30f, status = "В пути", dispatcher = "ApproachControl" });
			planesList.Add(new Board { plane_id = "002", x = 40f, y = 50f, z = 60f, status = "На земле", dispatcher = "ApproachControl" });
			planesList.Add(new Board { plane_id = "003", x = 70f, y = 80f, z = 90f, status = "Прибыл", dispatcher = "ApproachControl" });

			// Создание элемента DataGridView
			DataGridView dataGridView = new DataGridView();
			dataGridView.Dock = DockStyle.Fill;

			// Добавление столбцов
			dataGridView.Columns.Add("plane_id", "ID самолета");
			dataGridView.Columns.Add("x", "X");
			dataGridView.Columns.Add("y", "Y");
			dataGridView.Columns.Add("z", "Z");
			dataGridView.Columns.Add("status", "Статус");
			dataGridView.Columns.Add("dispatcher", "Диспетчер");

			// Заполнение таблицы данными
			foreach (var plane in planesList)
			{
				dataGridView.Rows.Add(plane.plane_id, plane.x, plane.y, plane.z, plane.status, plane.dispatcher);
			}

			// Добавление элемента DataGridView на форму и запуск приложения
			Form1 form = new Form1();
			form.Controls.Add(dataGridView);
			Application.Run(form);
		}
	}
}