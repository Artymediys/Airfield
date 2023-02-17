package com.example.groundRouteLogic;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

@DisplayName("Tests groundRouteApi")
class GraphGroundTest {

    @Test
    void testGetRouteAlgorithmTrue() {

        List<Integer> expectedRes = List.of(13, 3, 7, 6, 9, 17, 16, 15, 14, 14);
        List<Integer> actualRes = GraphGround.getRouteAlgorithm(13, 14);

        assertArrayEquals(expectedRes.toArray(), actualRes.toArray());
    }
}