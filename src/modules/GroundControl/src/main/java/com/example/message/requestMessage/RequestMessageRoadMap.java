package com.example.message.requestMessage;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RequestMessageRoadMap implements Serializable {

    private String type;
    private String transportId;
    private String endPoint;
}
