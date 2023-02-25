package com.example.message.responseMessage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseMessageRoadMap implements Serializable {

    private String transportId;
    private int[] roadMap;
}
