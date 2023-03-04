package com.example.groundRouteLogic;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class VehiclesTest {

    private static Vehicles vehicles;

    @BeforeAll
    static void init() {
        vehicles = new Vehicles();
    }

    @Test
    void changeOrAddLocation() {
    }

    @Test
    void findVehicleById() {

        assertEquals(12, vehicles.findVehicleById("PB1"));
    }
}