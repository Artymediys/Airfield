package com.example.message.requestMessage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCompleteSegment implements Serializable {

    private String transportId;
    private int moveFrom;
    private int moveTo;
    private boolean status;
}
