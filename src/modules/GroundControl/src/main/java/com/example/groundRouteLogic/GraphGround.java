package com.example.groundRouteLogic;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Component
public class GraphGround {

    private static final int MAX_VAL = 10000;
    private static final int SIZE_GRAPH = 19;
    //Show the airport map in graph view
    private static final int[][] graphList = {
            {0, 115, MAX_VAL, 41, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {115, 0, 109, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, 109, 0, MAX_VAL, MAX_VAL, MAX_VAL, 41, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {41, MAX_VAL, MAX_VAL, 0, 118, MAX_VAL, MAX_VAL, 42, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, 118, 0, 69, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 69, 0, 37, MAX_VAL, 23, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, 41, MAX_VAL, MAX_VAL, 37, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 20, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, 42, MAX_VAL, MAX_VAL, MAX_VAL, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 30, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 30},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 23, MAX_VAL, MAX_VAL, 0, 61, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 97, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 61, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, 35, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 0, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 30, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 0, 20, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 20, 0, 20, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 20, 0, 20, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 97, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 20, 0, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 20, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL},
            {MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, 30, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL, MAX_VAL}
    };

    //converter
    public static Map<String, Integer> nameToIntControlCheckPoint;

    static {
        nameToIntControlCheckPoint = new HashMap<>();
        nameToIntControlCheckPoint.put("Baggage Tractor", 11);
        nameToIntControlCheckPoint.put("Passenger Bus", 12);
        nameToIntControlCheckPoint.put("VIP", 13);
        nameToIntControlCheckPoint.put("Refueler", 18);
        nameToIntControlCheckPoint.put("Follow me", 19);
        nameToIntControlCheckPoint.put("Meeting point", 8);
        nameToIntControlCheckPoint.put("AP1", 14);
        nameToIntControlCheckPoint.put("AP2", 15);
        nameToIntControlCheckPoint.put("AP3", 16);
        nameToIntControlCheckPoint.put("AP4", 17);
        nameToIntControlCheckPoint.put("Start point", 10);
        nameToIntControlCheckPoint.put("Board", 8);

    }

    public int convertStringToIntControl(String stringValueCheckPoint) {

        return nameToIntControlCheckPoint.get(stringValueCheckPoint);
    }


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

        //streamRoute.forEach(s-> System.out.println(s+" "));

        return routeCheckPoints.stream().
                collect(reverseOrderCollectionToList()).mapToInt(Integer::intValue).toArray();
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
