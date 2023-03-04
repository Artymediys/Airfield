package com.example.groundRouteLogic;


import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class Vehicles {

    public static Map<String, Integer> vehiclesPosition;

    //pos for proj start
    static {
        vehiclesPosition = new HashMap<>();
        //Follow me pos
        vehiclesPosition.put("FM1", 19);
        vehiclesPosition.put("FM2", 19);
        vehiclesPosition.put("FM3", 19);
        vehiclesPosition.put("FM4", 19);
        //Baggage Tractor pos
        vehiclesPosition.put("BG1", 11);
        vehiclesPosition.put("BG2", 11);
        vehiclesPosition.put("BG3", 11);
        vehiclesPosition.put("BG4", 11);
        //Refueler pos
        vehiclesPosition.put("RF1", 18);
        vehiclesPosition.put("RF2", 18);
        vehiclesPosition.put("RF3", 18);
        vehiclesPosition.put("RF4", 18);
        //Bus pos
        vehiclesPosition.put("PB1", 12);
        vehiclesPosition.put("PB2", 12);
        vehiclesPosition.put("PB3", 12);
        vehiclesPosition.put("PB4", 12);
        vehiclesPosition.put("PB5", 12);
        vehiclesPosition.put("PB6", 12);
        vehiclesPosition.put("PB7", 12);
        vehiclesPosition.put("PB8", 12);

    }

    public void changeOrAddLocation(String transportId, int controlCheckPoint) {

        vehiclesPosition.put(transportId, controlCheckPoint);
    }

    public int findVehicleById(String transportId) {

        return vehiclesPosition.get(transportId);
    }
}
