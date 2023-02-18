package com.example.message.requestMessage;


import lombok.Data;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Data
@Component
public class RequestMessageRoadMap implements Serializable {

    private String type;
    private String transportId;
    private int startPoint;
    private int endPoint;
}
