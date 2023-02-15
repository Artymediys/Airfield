using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Threading.Channels;
using System.Xml.Linq;

namespace ApproachControl
{
	internal class Program
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

		static void Main(string[] args)
		{
			Rabbit rabbit = new Rabbit();
			rabbit.Send("Approach Control", "Visualizer");
			


		}


	}
}