package com.example.groundRouteLogic;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Component
public class GraphGround {

    private static final int MAX_VAL = 10000;
    private static final int SIZE_GRAPH = 17;
    //Show the airport map in graph view
    private static int[][] graphList = {
            {0, 115, MAX_VAL, 41, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {115, 0, 109, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, 109, 0, MAX_VAL, MAX_VAL, MAX_VAL, 41, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {41, MAX_VAL, MAX_VAL, 0, 118, MAX_VAL, MAX_VAL, 42, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, 118, 0, 69, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 69, 0, 37, MAX_VAL, 23, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, 41, MAX_VAL, MAX_VAL, 37, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, 42, MAX_VAL, MAX_VAL, MAX_VAL, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 30, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 23, MAX_VAL, MAX_VAL, 0, 61, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 97},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 61, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 30, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 0, 20, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 20, 0, 20, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 20, 0, 20},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 97, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 20, 0}
    };

    public int[] dijkstraAlgorithm(int startIndex, int endIndex) {

        List<Integer> routeCheckPoints = new ArrayList<>();//on exit get route in control points
        int[] minDist = new int[SIZE_GRAPH];// min distance
        int[] visitedNodes = new int[SIZE_GRAPH];//visited Nodes in progress
        int temp, minindex, min;
        int startPoint = startIndex - 1;
        int endPoint = endIndex - 1;

        //Initialize internal array
        for (int i = 0; i < SIZE_GRAPH; i++) {

            minDist[i] = MAX_VAL;
            visitedNodes[i] = 1;
        }
        minDist[startPoint] = 0;

        //algorithm step
        do {
            minindex = MAX_VAL;
            min = MAX_VAL;

            for (int i = 0; i < SIZE_GRAPH; i++) {

                if ((visitedNodes[i] == 1) && (minDist[i] < min)) {

                    min = minDist[i];
                    minindex = i;
                }
            }

            if (minindex != MAX_VAL) {

                for (int i = 0; i < SIZE_GRAPH; i++) {

                    if (graphList[minindex][i] != MAX_VAL) {
                        temp = min + graphList[minindex][i];
                        if (temp < minDist[i]) {
                            minDist[i] = temp;
                        }
                    }
                }
                visitedNodes[minindex] = 0;
            }
        } while (minindex < MAX_VAL);

        //get back check point in route
        routeCheckPoints.add(endPoint + 1);
        int k = 1;
        int weightNode = minDist[endPoint];

        while (endPoint != startPoint) {

            for (int i = 0; i < SIZE_GRAPH; i++) {

                if (graphList[i][endPoint] != MAX_VAL) {

                    temp = weightNode - graphList[i][endPoint];
                    if (temp == minDist[i]) {

                        weightNode = temp;
                        endPoint = i;
                        routeCheckPoints.add(i + 1);
                    }
                }
            }
        }
        //fix alg-m
        if (routeCheckPoints.get(0) == routeCheckPoints.get(1)) {
            routeCheckPoints.remove(0);
        }
        //print
        System.out.println();
        log.info("Result in ControlCheckpoints");

        int[] roadMap = routeCheckPoints.stream().
                collect(reverseOrderCollectionToList()).mapToInt(Integer::intValue).toArray();
        //streamRoute.forEach(s-> System.out.println(s+" "));

        return roadMap;
    }

    //get in reverse order
    private static <T> Collector<T, ?, Stream<T>> reverseOrderCollectionToList() {

        return Collectors.collectingAndThen(Collectors.toList(),
                list -> {
                    Collections.reverse(list);
                    return list.stream();
                });
    }


}
