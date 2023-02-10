using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Xml.Linq;

namespace ApproachControl
{
	internal class Program
	{
        static void Receive(string message)
        {
            if(message == "Start")
            {
                Console.WriteLine("Вау");
            }
        }

        static void Main(string[] args)
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
            var channel = connection.CreateModel();
            string name = "Approach Control";

            // Создание очереди
            channel.QueueDeclare(
                queue: name,
                durable: true,
                exclusive: false,
                autoDelete: true,
                arguments: null
                );

            // Слушаем очередь
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                Receive(message);
                Console.WriteLine($" [x] Received {message}");
            };
            channel.BasicConsume(queue: "Visualizer",
                                 autoAck: true,
                                 consumer: consumer);
            // Создаем exchange
            channel.ExchangeDeclare(
            exchange: name,
            type: "fanout",
            durable: true,
            autoDelete: true,
            arguments: null);

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

            //Отправка сообщения Visualizer, означающее, что вы подключились
            string message = name;
            var body = Encoding.UTF8.GetBytes(message);
            channel.BasicPublish(
                exchange: "Visualizer",
                routingKey: "Visualizer",
                basicProperties: null,
                body: body);


        }


	}
}