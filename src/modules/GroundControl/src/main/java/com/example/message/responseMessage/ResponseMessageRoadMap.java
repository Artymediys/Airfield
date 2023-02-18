package com.example.message.responseMessage;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Data
@Component
public class ResponseMessageRoadMap implements Serializable {

    private String transportId;
    private String roadMap;
}
