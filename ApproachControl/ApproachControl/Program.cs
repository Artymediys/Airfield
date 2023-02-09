using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Xml.Linq;

namespace ApproachControl
{
	internal class Program
	{
        static void SendMessage(string message)
        {

        }

        static void Main(string[] args)
		{


            // Подключение к RabbitMo
            var factory = new ConnectionFactory { HostName = "Localhost" };
            var connection = factory.CreateConnection();
            var channel = connection.CreateModel();
            string name = "ApproachControl";

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
                SendMessage(message);
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
                exchange: "имя вашего модуля",
                queue: "имя вашего модуля",
                routingKey: "имя вашего модуля"
                );

            //Подключение к global exchange
            channel.QueueBind(
                exchange: "global",
                queue: "имя вашего модуля",
                routingKey: "имя вашего модуля"
                );

            //Отправка сообщения Visualizer, означающее, что вы подключились
            string message = "Tower Control";
            var body = Encoding.UTF8.GetBytes(message);
            channel.BasicPublish(
                exchange: "Visualizer",
                routingKey: "Visualizer",
                basicProperties: null,
                body: body);


        }


	}
}