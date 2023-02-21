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

			// ���������� ��������� � ������
			planesList.Add(new Board { plane_id = "001", x = 10f, y = 20f, z = 30f, status = "� ����", dispatcher = "ApproachControl" });
			planesList.Add(new Board { plane_id = "002", x = 40f, y = 50f, z = 60f, status = "�� �����", dispatcher = "ApproachControl" });
			planesList.Add(new Board { plane_id = "003", x = 70f, y = 80f, z = 90f, status = "������", dispatcher = "ApproachControl" });

			// �������� �������� DataGridView
			DataGridView dataGridView = new DataGridView();
			dataGridView.Dock = DockStyle.Fill;

			// ���������� ��������
			dataGridView.Columns.Add("plane_id", "ID ��������");
			dataGridView.Columns.Add("x", "X");
			dataGridView.Columns.Add("y", "Y");
			dataGridView.Columns.Add("z", "Z");
			dataGridView.Columns.Add("status", "������");
			dataGridView.Columns.Add("dispatcher", "���������");

			// ���������� ������� �������
			foreach (var plane in planesList)
			{
				dataGridView.Rows.Add(plane.plane_id, plane.x, plane.y, plane.z, plane.status, plane.dispatcher);
			}

			// ���������� �������� DataGridView �� ����� � ������ ����������
			Form1 form = new Form1();
			form.Controls.Add(dataGridView);
			Application.Run(form);
		}
	}
}