package com.example.service.serviceImp;

import com.example.groundRouteLogic.GraphGround;
import com.example.groundRouteLogic.PermissionForMoving;
import com.example.groundRouteLogic.Vehicles;
import com.example.message.requestMessage.RequestBoardLocation;
import com.example.message.requestMessage.RequestCompleteSegment;
import com.example.message.requestMessage.RequestMessagePermission;
import com.example.message.requestMessage.RequestMessageRoadMap;
import com.example.message.responseMessage.ResponseMessagePermission;
import com.example.message.responseMessage.ResponseMessageRoadMap;
import com.example.service.serviceInterface.RouteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final GraphGround graphGround;
    private final PermissionForMoving permission;
    private final Vehicles vehicles;

    //construct the roadMap
    public ResponseMessageRoadMap createRoadMap(RequestMessageRoadMap request) {

        int startIndex = vehicles.findVehicleById(request.getTransportId());
        int endIndex = graphGround.convertStringToIntControl(request.getEndPoint());

        int[] roadMapArray = graphGround.dijkstraAlgorithm(startIndex, endIndex);
        log.info("create RoadMap complete");

        return new ResponseMessageRoadMap(request.getTransportId(), roadMapArray);

    }

    //return the roadStatus of segment
    public ResponseMessagePermission checkRouteSegment(RequestMessagePermission messagePermission) {

        boolean flagPermission = permission
                .checkForFreeSegment(messagePermission.getMoveFrom(), messagePermission.getMoveTo());
        return new ResponseMessagePermission(messagePermission.getTransportId(), flagPermission);

    }

    //make segment free to ride, change location for vehicle
    @Transactional
    public void completeSegment(RequestCompleteSegment requestCompleteSegment) {

        permission.refreshPermissionList(requestCompleteSegment.getMoveFrom(),
                requestCompleteSegment.getMoveTo());
        vehicles.changeOrAddLocation(requestCompleteSegment.getTransportId(),
                requestCompleteSegment.getMoveTo());

    }

    public void setLocationForBoard(RequestBoardLocation requestBoardLocation) {

        vehicles.changeOrAddLocation(requestBoardLocation.getBoardId(),
                graphGround.convertStringToIntControl(requestBoardLocation.getLocation()));
    }


}
