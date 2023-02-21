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

namespace ApproachControl
{
	class Rabbit
	{
        IModel channel;
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

			// Создание очереди
			channel.QueueDeclare(
				queue: name,
				durable: true,
				exclusive: false,
				//autoDelete: true,
				arguments: null
				);

			//Подключение к exchange вашего модуля
			channel.QueueBind(
				exchange: name,
				queue: name,
				routingKey: name
				);

			//Подключение к global exchange
			channel.QueueBind(
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

	}

	class BoardControl
	{
		Rabbit rabbit = new Rabbit();
		public BoardControl() { }
		List<Board> activeBoards = new List<Board>();
		string name = "ApproachControl";

		JsonSerializerOptions options = new JsonSerializerOptions()
		{
			WriteIndented = true,
			Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
			IgnoreNullValues = true
		};//Выставление опций сериализации

		HttpRequestMessage Transfer(Board board)
		{
			Board request = new Board();
			request.SetStateForJSON(board.plane_id, null, null, null, null, "Tower control");
			string body = JsonSerializer.Serialize<Board>(request, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
			msg.Headers.Add(name, "/transfer");
			return msg;
		}//POST /transfer, body: json { "plane_id": string, "dispatcher": string }

		HttpRequestMessage TransferPlane(Board board)
		{
			Board request = new Board();
			request.SetStateForJSON(board.plane_id);
			string body = JsonSerializer.Serialize<Board>(request, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
			msg.Headers.Add(name, "/transfer_plane");
			return msg;
		}//POST /transfer_plane, body: json { "plane_id": string }

		HttpRequestMessage PlaneOutOfZone(Board board)
		{
			Board request = new Board();
			request.SetStateForJSON(board.plane_id, null, null, null, null, null, true);
			string body = JsonSerializer.Serialize<Board>(request, options);
			HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
			msg.Headers.Add(name, "/plane_out_of_zone");
			return msg;
		}//POST /plane_out_of_zone, body: json { "plane_id": string, "out_of_zone": bool }

		HttpRequestMessage Destination(string id, float x, float y, float z)
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
            HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Get, body);//Тарас подшамань
			msg.Headers.Add(name, header);
			return msg;
		}//GET /current_cord?id=...

		void GetCordAnsver(Board board, string jsonString)
		{
			board = JsonSerializer.Deserialize<Board>(jsonString);
		}//json { "x": number, "y": number, "z": number  }


		float width = 10f;
		float length = 10f;


		void AddNewBoard(string json)
		{
			Board? board = JsonSerializer.Deserialize<Board>(json);
			activeBoards.Add(board);
			RouteCalculating(board);
		}//Добавление борта в список бортов для управления

		void RouteCalculating(Board board)
		{
			//GetCordRequest(board);
		}//Просчет маршрута движения самолетов для передачи на круг и для вывода за пределы зоны покрытия



	}


	public class Board
	{//БОООООООООООООООООЛЬШЕЕЕЕЕЕЕЕЕЕЕЕЕЕ ВООООООООПРОООООООООООСИИИИИИИИКООООООООООООВ
		public string? plane_id { get; set; }
		public float? x { get; set; }
		public float? y { get; set; }
		public float? z { get; set; }
		public string? status { get; set; }
		public string? dispatcher { get; set; }

		public bool? outOfZone { get; set; }
		public void SetStateForJSON(string? id = null, float? x = null, float? y = null,
			float? z = null, string? status = null, string? dispatcher = null, bool? outOfZone = null)
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
			BoardControl board = new BoardControl();
			Board boarder = new Board();
			boarder.plane_id = "1212";
			string test = board.GetCordRequest(boarder).ToString();
			Console.WriteLine(test);
			// Создание списка самолетов
		}
	}
}