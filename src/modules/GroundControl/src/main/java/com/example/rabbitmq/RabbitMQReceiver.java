package com.example.rabbitmq;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@EnableRabbit
@Component
public class RabbitMQReceiver {

    @Value("${rabbitmq.queue}")
    private String queueName;


    @RabbitListener(queues = "Ground Control")
    public void worker1(String message) {
        log.info("accepted on Ground Control : " + message);
    }


}