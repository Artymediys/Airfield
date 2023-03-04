package com.example.groundRouteLogic;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;


class PermissionForMovingTest {


    private static PermissionForMoving permission;

    @BeforeAll
    static void setUp() {
        permission = new PermissionForMoving();
    }

    @Test
    void checkForFreeSegmentTrue() {

        boolean actualRes = permission.checkForFreeSegment(2, 3);
        assertTrue(actualRes);
    }

    @Test
    void checkForFreeSegmentFalse() {

        boolean actualRes = permission.checkForFreeSegment(1, 12);
        assertFalse(actualRes);
    }
}