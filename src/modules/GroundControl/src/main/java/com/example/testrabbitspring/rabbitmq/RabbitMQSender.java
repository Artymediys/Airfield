package com.example.testrabbitspring.rabbitmq;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RabbitMQSender {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchangeGL}")
    private String exchangeGLName;
    @Value("${rabbitmq.exchangeGC}")
    private String exchangeGCname;

    public void send() {
        rabbitTemplate.setExchange(exchangeGCname);
        rabbitTemplate.convertAndSend("Ground Control");
        log.info("Sending Message to the GroundExchange : Ground Control");
    }

    public void sendHelloToServer() throws InterruptedException {

        String responseHello = "";
        rabbitTemplate.setExchange(exchangeGLName);
        log.info("Send Hello message to Global");

        while (responseHello == (String) rabbitTemplate.convertSendAndReceive("Ground Control")) {

            log.warn("Didnt get the response");
            Thread.sleep(1000);
        }
        log.info("Server is ready for work");
    }


}
