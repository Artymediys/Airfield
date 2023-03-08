package com.example.groundRouteLogic;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class PermissionForMoving {

    private static final boolean FALSE = false;

    private static boolean[][] permissionList = {
            {true, true, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {true, true, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {FALSE, true, true, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {true, FALSE, FALSE, true, true, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {FALSE, FALSE, FALSE, true, true, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {FALSE, FALSE, FALSE, FALSE, true, true, true, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {FALSE, FALSE, true, FALSE, FALSE, true, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE},
            {FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, true},
            {FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, true, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE},
            {FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, true, true, FALSE, FALSE, FALSE, FALSE},
            {FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, true, true, FALSE, FALSE, FALSE},
            {FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, true, true, FALSE, FALSE},
            {FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, true, FALSE, FALSE},
            {FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE},
            {FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, true, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE}
    };

    //return the permission about moving in such segment
    public boolean checkForFreeSegment(int startSegment, int finishSegment) {
        //log.info("status on segment:{} {}={}",startSegment,finishSegment,permissionList[startSegment-1][finishSegment-1]);
        if (permissionList[startSegment - 1][finishSegment - 1]) {

            permissionList[startSegment - 1][finishSegment - 1] = false;
            return true;
        } else return false;
    }

    public void refreshPermissionList(int startPoint, int finishPoint) {
        //log.info("status on segment:{} {}={}",startPoint,finishPoint,permissionList[startPoint-1][finishPoint-1]);
        if (!permissionList[startPoint - 1][finishPoint - 1]) {

            permissionList[startPoint - 1][finishPoint - 1] = true;
        }
        //log.info("status on segment:{} {}={}",startPoint,finishPoint,permissionList[startPoint-1][finishPoint-1]);
    }


}
