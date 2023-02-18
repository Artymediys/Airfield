package com.example.groundRouteLogic;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

@DisplayName("Tests groundRouteApi")
class GraphGroundTest {


    private static GraphGround graphGround;

    @BeforeAll
    static void initGraphGround() {
        graphGround = new GraphGround();
    }

    @Test
    void testDijkstraAlgorithmTrue() {

        int[] expectedRes = new int[]{13, 3, 7, 6, 9, 17, 16, 15, 14};
        int[] actualRes = graphGround.dijkstraAlgorithm(13, 14);
        assertArrayEquals(expectedRes, actualRes);
    }
}