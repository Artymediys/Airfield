using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;
using System.Xml.Linq;

namespace ApproachControl
{
    class Rabbit
    {
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
                autoDelete: true,
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
        IModel channel;
        string name = "Approach Control";

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

    internal class Program
	{
		static void Main(string[] args)
		{
			Rabbit rabbit = new Rabbit();
			rabbit.Send("Approach Control", "Visualizer");
			


		}
	}

    class BoardControl
    {
        Rabbit rabbit = new Rabbit();
        public BoardControl() { }
        List<Board> activeBoards = new List<Board>();

        bool PlaneTransfer()
        {
            string body = "";
            HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Get, body);
            

            return true;
        }
        void AddNewBoard(string json)
        {
            Board? board = JsonSerializer.Deserialize<Board>(json);
            activeBoards.Add(board);
        }
        void RouteCalculating(Board board)
        {
            //Реализация просчета маршрутов
        }
    }
    class Board
    {
        string id;
        float x, y, z;
        string status;

        HttpRequestMessage Destination(float x, float y, float z)
        {
            Dot destination = new Dot(id, x, y, z);
            string body = JsonSerializer.Serialize(destination);
            HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Post, body);
            return msg;
        }//POST /destination, body: json { "plane_id": string, "x": number, "y": number, "z": number }

        void GetCord(HttpRequestMessage msg)
        {
            string body = msg.RequestUri.ToString();
            Dot curentCord = JsonSerializer.Deserialize<Dot>(body);
            x = curentCord.x;
            y = curentCord.y;
            z = curentCord.z;
        }

        void Transfer()
        {
            string body = "{ \"plane_id\": ... , \"operator\": ... }";
        }//POST /transfer, body: json { "plane_id": string, "operator": string }
    }

    class Dot
    {
        string plane_id;
        public float x, y, z;
        public Dot(string id, float x, float y, float z)
        {
            plane_id = id;
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
}