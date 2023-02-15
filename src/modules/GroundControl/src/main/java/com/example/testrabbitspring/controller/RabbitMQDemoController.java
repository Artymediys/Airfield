package com.example.testrabbitspring.controller;

import com.example.testrabbitspring.rabbitmq.RabbitMQSender;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/rabbitmq")
public class RabbitMQDemoController {

    private final RabbitMQSender rabbitMQSender;

    @PostMapping(value = "/sender")
    public String producer() {
        rabbitMQSender.send();
        return "Message sent to the RabbitMQ Queue Successfully";
    }


}
