package com.example.service.serviceInterface;

import com.example.message.requestMessage.RequestMessageRoadMap;
import com.example.message.responseMessage.ResponseMessageRoadMap;

public interface RouteService {

    ResponseMessageRoadMap createRoadMap(RequestMessageRoadMap request);
}
