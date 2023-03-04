using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Threading.Channels;
using System.Xml.Linq;
using System.Text.Json.Serialization;
using System.Numerics;
using System.Text.RegularExpressions;

namespace ApproachControl
{
	class Rabbit
	{
		IModel channel;
		IModel globalChanel;
		string name = "Approach Control";
		public Rabbit()
		{
			// Подключение к RabbitMo
			var factory = new ConnectionFactory
			{
				HostName = "178.20.43.80",
				UserName = "guest",
				Password = "guest",
				VirtualHost = "/",
				Port = 5672
			};
			var connection = factory.CreateConnection();
			channel = connection.CreateModel();
			globalChanel = connection.CreateModel();
			// Создание очереди
			channel.QueueDeclare(
				queue: name,
				durable: true,
				exclusive: false,
				autoDelete: true,
				arguments: null
				);

			globalChanel.QueueDeclare(
				queue: name,
				durable: true,
				exclusive: false,
				arguments: null
				);

			//Подключение к exchange вашего модуля
			channel.QueueBind(
				exchange: name,
				queue: name,
				routingKey: name
				);

			globalChanel.QueueBind(
				exchange: "global",
				queue: name,
				routingKey: name
				);
		}
		public void Send(string message, string direction)
		{
			//Отправка сообщения Visualizer, означающее, что вы подключились
			var body = Encoding.UTF8.GetBytes(message);
			channel.BasicPublish(
				exchange: direction,
					routingKey: direction,
					basicProperties: null,
					body: body);
		}

		public string Receive(string direction = "Visualizer")
		{
			// Слушаем очередь
			var consumer = new EventingBasicConsumer(channel);
			string message = "";
			consumer.Received += (model, ea) =>
			{
				var body = ea.Body.ToArray();
				message = Encoding.UTF8.GetString(body);
				Console.WriteLine($" [x] Received {message}");
			};
			channel.BasicConsume(queue: direction,
										autoAck: true,
										consumer: consumer);
			return message;
		}

		public bool IsStart()
		{
			var consumer = new EventingBasicConsumer(globalChanel);
			string message = "";
			consumer.Received += (model, ea) =>
			{
				var body = ea.Body.ToArray();
				message = Encoding.UTF8.GetString(body);
				Console.WriteLine($" [x] Received {message}");
			};
			globalChanel.BasicConsume(queue: "Visualizer",
										autoAck: true,
										consumer: consumer);

			if(message.ToLower() == "start")
				return true;
			return false;
		}
	}

	class BoardControl
	{
		Rabbit rabbit = new Rabbit();
		BoardCommunication bc = new BoardCommunication();
		List<Board> activeBoards = new List<Board>();
		List<Board> newBoards = new List<Board>();
		List<Board> transitBoards = new List<Board>();
		List<Board> boardsGoAway = new List<Board>();
		List<Board> newBoardsGoAway = new List<Board>();
		

		void Start()
		{
			bc.Start();
			Thread thread = new Thread(() => { WorkWithBoard(); });
			thread.IsBackground = true;
			thread.Start(); 
			thread = new Thread(() => { WorkWithTower(); });
			thread.IsBackground = true;
			thread.Start();
			thread = new Thread(() => { bc.Reciver(); });
			thread.IsBackground = true;
			thread.Start();

			while (true)
			{}
		}
		void WorkWithBoard()
		{
			int boardsCount = activeBoards.Count;
			int transitCount = transitBoards.Count;
			int ansCount = 0;
			int towerAnsCount = 0;
			int k = 0;

			while (true)
			{
				
				int take = bc.GetOneAnsverBool();
				if(take == 1)
				{
					try
					{
						bc.Transfer(transitBoards[k]);
						towerAnsCount++;
						transitBoards.RemoveAt(k);
					}
					catch (Exception)
					{
						k++;
					}
				}

				if (transitCount == towerAnsCount)
				{
					for (int i = k; i < transitBoards.Count; i++)
					{
						bc.TransferPlane(transitBoards[i]);
					}
					towerAnsCount = transitBoards.Count;
				}


				Board temp = new Board();
				bool flag = false;
				temp = bc.GetOneAnsverBoardNew();

				if (temp == null)
					continue;

				foreach (Board board in activeBoards)
				{
					if (board.plane_id == temp.plane_id)
					{
						if (board.dx == temp.x && board.dy == temp.y && board.dz == temp.z)
						{
							board.x = temp.x;
							board.y = temp.y;
							board.z = temp.z;

							if (RouteCalculating(board)) 
							{
								transitBoards.Add(board);
								activeBoards.Remove(board);
								bc.TransferPlane(board);
							};
						}
						ansCount++;
						flag = true;
						break;
					}
				}

				if (!flag)
				{
					RouteCalculating(temp);
					newBoards.Add(temp);
				}
					
				if (boardsCount == ansCount)
				{
					foreach (Board board in activeBoards)
					{
						bc.GetCordRequest(board);
					}
					activeBoards = activeBoards.Concat(newBoards).ToList();
					boardsCount = activeBoards.Count;
				}
			}
		}

		void WorkWithTower()
		{
			int boardsCount = boardsGoAway.Count;
			int ansCount = 0;

			while (true)
			{
				Board temp = new Board();
				bool flag = false;
				temp = bc.GetOneAnsverBoardGoAway();

				if (temp == null)
					continue;


				foreach (Board board in boardsGoAway)
				{
					if (board.plane_id == temp.plane_id)
					{
						if (board.dx == temp.x && board.dy == temp.y && board.dz == temp.z)
						{
							bc.PlaneOutOfZone(board);
							boardsGoAway.Remove(board);
						}
						ansCount++;
						flag = true;
						break;
					}
				}

				if (!flag)
				{
					newBoardsGoAway.Add(temp);
					AwayCalculating(temp);
				}

				if (boardsCount == ansCount)
				{
					foreach (Board board in boardsGoAway)
					{
						bc.GetCordRequest(board);
					}
					boardsGoAway = boardsGoAway.Concat(newBoardsGoAway).ToList();
					boardsCount = boardsGoAway.Count;
				}
			}
		}

		bool RouteCalculating(Board board)
		{
			if ((board.y > -1 && board.y < 1) && ((board.x > -174 && board.x < -172) || (board.x > 172 && board.x < 174)))
				return true;

			if (board.y != 0 && (board.x < -173|| board.x > 173))
			{
				board.dy = 0f;
				board.dx = board.x;
				board.dz = board.z;
			}
			else if (board.y != 0 && (board.x >= -173 || board.x <= 173))
			{
				if ((-173 + board.x) < (board.x - 173))
				{
					board.dy = board.y;
					board.dx = -210f;
					board.dz = board.z;
				}
				else
				{
					board.dy = board.y;
					board.dx = 210f;
					board.dz = board.z;
				}
			}
			else
			{
				if ((-173 + board.x) < (board.x - 173))
				{
					board.dy = board.y;
					board.dx = -173f;
					board.dz = board.z;
				}
				else
				{
					board.dy = board.y;
					board.dx = 173f;
					board.dz = board.z;
				}
			}
			bc.Destination(board);
			return false;

		}//Просчет маршрута движения самолетов для передачи на круг

		void AwayCalculating(Board board)
		{
			if ((board.x > 490f || board.x < -490f) && (board.y < -17f))
			{
				bc.PlaneOutOfZone(board);
			}


			if (board.x > 0)
			{
				board.dx = 500f;
				board.dy = -20f;
				board.dz = board.z;
			}
			else
			{
				board.dx = -500f;
				board.dy = -20f;
				board.dz = board.z;
			}
			bc.Destination(board);
		}//Просчет маршрута движения самолетов для передачи на круг и для вывода за пределы зоны покрытия
	}


	class BoardCommunication
	{
		List<bool> AnsverBool = new List<bool>();
		List<Board> AnsverBoardGoAway = new List<Board>();
		List<Board> AnsverBoardNew = new List<Board>();
		List<Board> ActiveBoardArrive = new List<Board>();
		List<Board> ActiveBoardGoAway = new List<Board>();


		Rabbit rabbit = new Rabbit();
		public BoardCommunication() { }

		string name = "ApproachControl";

		JsonSerializerOptions options = new JsonSerializerOptions()
		{
			WriteIndented = true,
			Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
			IgnoreNullValues = true
		};//Выставление опций сериализации


		int k = 0;
		#region BoardControl interaction
		public int GetOneAnsverBool()
		{
			if (AnsverBool.Count > 0)
			{
				bool ret = AnsverBool[k];
				try
				{
					AnsverBool.RemoveAt(k);
				}
				catch (Exception)
				{
					k++;
				}

				if (ret)
					return 1;
				else
					return 0;
			}
			return -1;
		}

		public Board GetOneAnsverBoardGoAway()
		{
			if (AnsverBoardGoAway.Count > 0)
			{
				Board board = AnsverBoardGoAway[0];
				AnsverBoardGoAway.Remove(board);
				return board;
			}
			return null;
		}

		public Board GetOneAnsverBoardNew()
		{
			if (AnsverBoardNew.Count > 0)
			{
				Board board = AnsverBoardNew[0];
				AnsverBoardGoAway.Remove(board);
				return board;
			}
			return null;
		}
		#endregion


		public void MessageParse(string message)//Обработка полученных сообщений
		{
			string regex = @"^Method:(\w*)";
			string reqUri = null;

			if (message != null)
			{
				if (Regex.IsMatch(message, regex))
				{
					reqUri = message.Substring(message.IndexOf("\'") + 1, message.LastIndexOf("\'") - message.IndexOf("\'") - 1);
					message = message.Remove(message.IndexOf("\'"), message.LastIndexOf("\'") - message.IndexOf("\'") + 1);
					string[] messPart = message.Split(',');

					foreach (string part in messPart)
					{
						if (part.Contains("Headers:"))
						{
							string nextStep = part.Substring(part.IndexOf('/') + 1, part.LastIndexOf("\r\n") - part.IndexOf('/') - 1);
							if (nextStep == "transfer_plane")
								SendTransferPlaneAnsver(reqUri);
							else if (nextStep == "new_board")
								AddNewBoardArriving(reqUri);
						}
					}
				}
				else
				{
					reqUri = message;
					if (reqUri.Contains("\"x\"") && reqUri.Contains("\"y\"") && reqUri.Contains("\"z\""))
					{
						GetCordAnsver(reqUri);
					}
					else if (reqUri.Contains("ready:"))
					{
						GetTransferPlaneAnsver(reqUri);
					}
				}
			}
			else
			{
				return;
			}
		}

		
		#region Recieve Message
		public void GetCordAnsver(string jsonString)
		{
			Board temp = new Board();
			temp = JsonSerializer.Deserialize<Board>(jsonString);
			foreach(Board board in ActiveBoardArrive)
			{
				if(temp.plane_id == board.plane_id)
				{
					AnsverBoardNew.Add(temp);
					return;
				}
			}
			AnsverBoardGoAway.Add(temp);
		}//json {"plane_id":string, "x": number, "y": number, "z": number  }

		class BoolAns
		{
			public bool ready { get; set; }
		}

		public void GetTransferPlaneAnsver(string jsonString)
		{
			BoolAns ans = new BoolAns();
			ans = JsonSerializer.Deserialize<BoolAns>(jsonString);
			AnsverBool.Add(ans.ready);
		}

		public void SendTransferPlaneAnsver(string jsonString)
		{
			Board board = new Board();
			board = JsonSerializer.Deserialize<Board>(jsonString);
			AnsverBoardGoAway.Add(board);
			ActiveBoardGoAway.Add(board);
			GetCordRequest(board);
			BoolAns ready = new BoolAns();
			ready.ready = true;
			string otvet = JsonSerializer.Serialize(ready, options);
			SendRequest(otvet, "Tower control");
		}

		public void Reciver()//Прослушивание Борта и Башни Круга
		{
			while (true)
			{
				for (int i = 0; i < 2; i++)
				{
					string destination;
					if (i == 0)
						destination = "Board";
					else
						destination = "Tower Control";
					try
					{
						string recievedMsg = rabbit.Receive(destination);
						MessageParse(recievedMsg);
					}
					catch (Exception)
					{
						continue;
					}
				}
			}
		}

		#endregion


		#region Sending Message
		public void TransferPlane(Board board)
		{
			Board request = new Board();
			request.SetStateForJSON(board.plane_id);
			string body = JsonSerializer.Serialize<Board>(request, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
			msg.Headers.Add(name, "/transfer_plane");
			SendRequest(msg, "Tower control");
		}//POST /transfer_plane, body: json { "plane_id": string }

		public void AddNewBoardArriving(string jsonString)
		{
			Board board = new Board();
			board = JsonSerializer.Deserialize<Board>(jsonString);
			AnsverBoardNew.Add(board);
			ActiveBoardArrive.Add(board);
		}//POST ..., body: {"plane_id":string, "x": number, "y": number, "z": number  }

		public void Transfer(Board board)
		{
			Board request = new Board();
			request.SetStateForJSON(board.plane_id, null, null, null, null, "Tower control");
			string body = JsonSerializer.Serialize<Board>(request, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
			msg.Headers.Add(name, "/transfer");
			SendRequest(msg, "Board");
		}//POST /transfer, body: json { "plane_id": string, "dispatcher": string }

		public void PlaneOutOfZone(Board board)
		{
			Board request = new Board();
			request.SetStateForJSON(board.plane_id, null, null, null, null, null, true);
			string body = JsonSerializer.Serialize<Board>(request, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
			msg.Headers.Add(name, "/plane_out_of_zone");
			SendRequest(msg, "Board");
		}//POST /plane_out_of_zone, body: json { "plane_id": string, "out_of_zone": bool }

		public void Destination(Board board)
		{
			Board destination = new Board();
			destination.SetStateForJSON(board.plane_id, board.dx, board.dy, board.dz);
			string jsonString = JsonSerializer.Serialize(destination, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, jsonString);
			msg.Headers.Add(name, "/destination");
			SendRequest(msg, "Board");
		}//POST /destination, body: json { "plane_id": string, "x": number, "y": number, "z": number }

		public void GetCordRequest(Board board)
		{
			string header = "/current_cord?id=" + board.plane_id;
			string? body = null;
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Get, body);
			msg.Headers.Add(name, header);
			SendRequest(msg, "Board");
		}//GET /current_cord?id=...

		public void SendRequest(HttpRequestMessage msg, string direction)
		{
			rabbit.Send(msg.ToString(), direction);
		}

		public void SendRequest(string msg, string direction)
		{
			rabbit.Send(msg, direction);
		}

		#endregion


		public void Start()
		{
			while (!rabbit.IsStart()) { }
		}
	}


	public class Board
	{//БОООООООООООООООООООООООООООООООЛЬШЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕЕ ВООООООООООООООООПРООООООООООООООООСИИИИИИИИКОООООООООООООООООООООООВ
		public string? plane_id { get; set; }
		public float? x { get; set; }
		public float? y { get; set; }
		public float? z { get; set; }
		public float? dx { get; set; }
		public float? dy { get; set; }
		public float? dz { get; set; }
		public string? status { get; set; }
		public string? dispatcher { get; set; }

		public bool? outOfZone { get; set; }
		public void SetStateForJSON(string? id = null, float? x = null, float? y = null,
			float? z = null, string? status = null, string? dispatcher = null, bool? outOfZone = null,
			float? dx = null, float? dy = null, float? dz = null)
		{
			plane_id = id;
			this.x = x;
			this.y = y;
			this.z = z;
			this.status = status;
			this.dispatcher = dispatcher;
			this.outOfZone = outOfZone;
		}
	}


	internal class Program
	{
		static void Main(string[] args)
		{
			//Rabbit rabbit = new Rabbit();
			//rabbit.Send("Approach Control", "Visualizer");
			BoardCommunication board = new BoardCommunication();
			Board boarder = new Board();
			boarder.plane_id = "1212";
			// Создание списка самолетов
		}
	}
}