package com.example.message.responseMessage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseMessagePermission implements Serializable {

    private String transportId;
    private boolean permission;


}
