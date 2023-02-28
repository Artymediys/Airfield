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
		BoardCommunication bc = new BoardCommunication();
		List<Board> activeBoards = new List<Board>();
		List<Board> newBoards = new List<Board>();
		float width = 10f;
		float length = 10f;
		int ansCount = 0;

		void Start()
		{
			bc.Start();
			Thread thread = new Thread(() => { WorkWithBoard(); });
			thread.IsBackground = true;
			thread.Start(); 
			thread = new Thread(() => { WorkWithTower(); });
			thread.IsBackground = true;
			thread.Start();


			while (true)
			{}
		}
		void WorkWithBoard()
		{

			while (true)
			{
				activeBoards = activeBoards.Concat(newBoards).ToList();
				int boardsCount = activeBoards.Count;

				//string ans = bc.GetAnsver("Board");
				string ans = "";
				if (ans[0] == '0')
				{

				}
				else if (ans[1] == '1')
				{

					ansCount++;
				}
				if (boardsCount == ansCount)//мб надо +1
				{
					foreach (Board board in activeBoards)
					{
						bc.GetCordRequest(board);
					}
				}
			}

		}

		void WorkWithTower()
		{
			while (true)
			{
				bc.GetAnsver("TowerControl");
			}
			
		}

		void AddNewBoard()
		{
			while(true) 
			{
				Board board = new Board();
				//board = bc.GetNewBoard();

				RouteCalculating(board);
				activeBoards.Add(board);
			};
		}//Добавление борта в список бортов для управления


		void RouteCalculating(Board board)
		{

		}//Просчет маршрута движения самолетов для передачи на круг и для вывода за пределы зоны покрытия

		void RouteCalculating()
		{
			while (true)
			{
				if (activeBoards.Count > 0)
				{
					foreach (Board board in activeBoards)
					{
						
					}
				}
			}
		}//Просчет маршрута движения самолетов для передачи на круг и для вывода за пределы зоны покрытия
	}


	class BoardCommunication
	{
		Rabbit rabbit = new Rabbit();
		public BoardCommunication() { }

		string name = "ApproachControl";

		JsonSerializerOptions options = new JsonSerializerOptions()
		{
			WriteIndented = true,
			Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
			IgnoreNullValues = true
		};//Выставление опций сериализации

		public void MessageParse(string message)//Обработка полученных сообщений
		{
			string regex = @"^Method:(\w*)";
			string reqUri = null;

			bool request = false;
			if (message != null)
			{
				if (Regex.IsMatch(message, regex))
					request = true;
				else
					reqUri = message;


				if (request)
				{
					reqUri = message.Substring(message.IndexOf("\'") + 1, message.LastIndexOf("\'") - message.IndexOf("\'") - 1);
					message = message.Remove(message.IndexOf("\'"), message.LastIndexOf("\'") - message.IndexOf("\'") + 1);
					string[] messPart = message.Split(',');

					foreach (string part in messPart)
					{
						if (part.Contains("Headers:"))
						{
							string nextStep = part.Substring(part.IndexOf('/') + 1, part.LastIndexOf("\r\n") - part.IndexOf('/') - 1);
							Console.WriteLine(nextStep);
							if (nextStep == "transfer_plane")
								TransferPlaneAnsver(reqUri);
							else if (nextStep == "new_board")
								GetCordAnsver(reqUri);
						}
					}
					Console.WriteLine(reqUri);
				}
				else
				{
					if (reqUri.Contains("\"x\"") && reqUri.Contains("\"y\"") && reqUri.Contains("\"z\""))
					{
						GetCordAnsver(reqUri);
					}
				}
			}
		}

		class BoolAns
		{
			public bool ready { get; set; }
		}

		public string TransferPlaneAnsver(string jsonString)
		{
			Board board = new Board();
			board = JsonSerializer.Deserialize<Board>(jsonString);
			GetCordRequest(board);
			BoolAns ready = new BoolAns();
			ready.ready = true;
			string otvet = JsonSerializer.Serialize(ready, options);
			return otvet;
		}

		public void GetCordAnsver(string jsonString)
		{
			Board board = new Board();
			board = JsonSerializer.Deserialize<Board>(jsonString);
		}//json { "x": number, "y": number, "z": number  }


		public HttpRequestMessage Transfer(Board board)
		{
			Board request = new Board();
			request.SetStateForJSON(board.plane_id, null, null, null, null, "Tower control");
			string body = JsonSerializer.Serialize<Board>(request, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
			msg.Headers.Add(name, "/transfer");
			return msg;
		}//POST /transfer, body: json { "plane_id": string, "dispatcher": string }

		public HttpRequestMessage TransferPlane(Board board)
		{
			Board request = new Board();
			request.SetStateForJSON(board.plane_id);
			string body = JsonSerializer.Serialize<Board>(request, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
			msg.Headers.Add(name, "/transfer_plane");
			return msg;
		}//POST /transfer_plane, body: json { "plane_id": string }

		public HttpRequestMessage PlaneOutOfZone(Board board)
		{
			Board request = new Board();
			request.SetStateForJSON(board.plane_id, null, null, null, null, null, true);
			string body = JsonSerializer.Serialize<Board>(request, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
			msg.Headers.Add(name, "/plane_out_of_zone");
			return msg;
		}//POST /plane_out_of_zone, body: json { "plane_id": string, "out_of_zone": bool }

		public HttpRequestMessage Destination(string id, float x, float y, float z)
		{
			Board destination = new Board();
			destination.SetStateForJSON(id, x, y, z);
			string jsonString = JsonSerializer.Serialize(destination, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, jsonString);
			msg.Headers.Add(name, "/destination");
			return msg;
		}//POST /destination, body: json { "plane_id": string, "x": number, "y": number, "z": number }

		public HttpRequestMessage GetCordRequest(Board board)
		{
			string header = "/current_cord?id=" + board.plane_id;
			string? body = null;
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Get, body);
			msg.Headers.Add(name, header);
			return msg;
		}//GET /current_cord?id=...


		public void Start() { while (!rabbit.IsStart()) { } }


		public void GetAnsver(string direction)
		{

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
			string test = board.GetCordRequest(boarder).ToString();
			Console.WriteLine(test);
			// Создание списка самолетов
		}
	}
}