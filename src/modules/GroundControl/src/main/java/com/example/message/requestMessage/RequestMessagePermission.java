package com.example.message.requestMessage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestMessagePermission implements Serializable {

    private String type;
    private String transportId;
    private int moveFrom;
    private int moveTo;
}
