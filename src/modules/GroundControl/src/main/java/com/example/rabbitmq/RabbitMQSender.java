package com.example.rabbitmq;

import com.example.message.requestMessage.RequestMessagePermission;
import com.example.message.responseMessage.ResponseMessagePermission;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class
RabbitMQSender {

    private final RabbitTemplate rabbitTemplate;
    private final DirectExchange directExchange;

    public void send() {

        RequestMessagePermission request = new RequestMessagePermission(
                "Ground Control", "board_777", 14, 15
        );


        TowerControl towerControl = new TowerControl("test request");
        rabbitTemplate.setExchange("Tower Control");
        rabbitTemplate.convertAndSend(towerControl);
        log.info("Sending Message to the Tower Control : Ground Control");
    }

    public void sendPermissionForMoving(ResponseMessagePermission responseMessagePermission, String exchange) {

        rabbitTemplate.convertAndSend(exchange + "_groundControl", "roadMap", responseMessagePermission);
        if (responseMessagePermission.isPermission()) {
            log.info("Send message response permission {}", responseMessagePermission);
        }
    }




}

