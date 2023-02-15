package com.example.testrabbitspring;

import com.example.testrabbitspring.rabbitmq.RabbitMQSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration(exclude = {org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration.class})
public class TestRabbitSpringApplication implements CommandLineRunner {

    public static void main(String[] args) {


        SpringApplication.run(TestRabbitSpringApplication.class, args);
    }

    private final RabbitMQSender rabbitMQSender;

    @Autowired
    public TestRabbitSpringApplication(RabbitMQSender rabbitMQSender) {
        this.rabbitMQSender = rabbitMQSender;
    }

    @Override
    public void run(String... args) throws Exception {

        rabbitMQSender.sendHelloToServer();

    }
}
