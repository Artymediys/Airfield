package com.example.groundRouteLogic;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DisplayName("Tests groundRouteApi")
class GraphGroundTest {


    private static GraphGround graphGround;

    @BeforeAll
    static void initGraphGround() {
        graphGround = new GraphGround();
    }

    @Test
    void testDijkstraAlgorithmTrue() {

        int[] expectedRes = new int[]{12, 2, 1, 4, 8, 14};
        int[] actualRes = graphGround.dijkstraAlgorithm(12, 14);
        assertArrayEquals(expectedRes, actualRes);
    }

    @Test
    void testConvertStringToIntControlTrue() {

        assertEquals(19,
                graphGround.convertStringToIntControl("Follow me"));
    }
}