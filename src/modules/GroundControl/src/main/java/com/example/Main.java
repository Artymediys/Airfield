package com.example;

import com.example.rabbitmq.RabbitMQSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration(exclude = {org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration.class})
public class Main implements CommandLineRunner {

    public static void main(String[] args) {


        SpringApplication.run(Main.class, args);
    }

    @Autowired
    private RabbitMQSender sender;

    @Override
    public void run(String... args) throws Exception {

        //rabbitMQSender.sendHelloToServer();
        sender.send();

    }
}
