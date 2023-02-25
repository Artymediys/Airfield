package com.example.rabbitmq;

import com.example.message.requestMessage.RequestMessagePermission;
import com.example.message.responseMessage.ResponseMessagePermission;
import com.example.service.serviceImp.RouteServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@EnableRabbit
@Component
@RequiredArgsConstructor
public class RabbitMQReceiver {

    private final RouteServiceImpl routeService;
    private final RabbitMQSender rabbitMQSender;

    @RabbitListener(queues = "Ground Control")
    public void listenerRoadMap(RequestMessagePermission request) {

        log.info("Received message permissionRequest {}", request.toString());
        rabbitMQSender.sendPermissionForMoving(
                routeService.checkRouteSegment(request), request.getType()
        );

    }

    @RabbitListener(queues = "temp")
    public void listenerTemp(ResponseMessagePermission response) {

        log.info("Received response{}", response.toString());
    }


}