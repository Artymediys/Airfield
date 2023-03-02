package com.example.controller;

import com.example.message.requestMessage.RequestBoardLocation;
import com.example.message.requestMessage.RequestCompleteSegment;
import com.example.message.requestMessage.RequestMessagePermission;
import com.example.message.requestMessage.RequestMessageRoadMap;
import com.example.message.responseMessage.ResponseBoardLocation;
import com.example.message.responseMessage.ResponseMessagePermission;
import com.example.message.responseMessage.ResponseMessageRoadMap;
import com.example.service.serviceImp.RouteServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/ground-control")
public class RouteController {

    private final RouteServiceImpl routeService;

    @PostMapping("/road-map")
    public ResponseEntity<ResponseMessageRoadMap> getRodeMapForVehicles(
            @RequestBody RequestMessageRoadMap roadCredentials) {
        return new ResponseEntity<>(routeService.createRoadMap(roadCredentials),
                HttpStatus.OK);
    }

    @PostMapping("/permission-in-segment")
    public ResponseEntity<ResponseMessagePermission> getPermissionOnSegment
            (@RequestBody RequestMessagePermission messagePermission) {
        return new ResponseEntity<>(routeService.checkRouteSegment(messagePermission), HttpStatus.OK);
    }

    @PostMapping("/road-map/segmentComplete")
    public HttpStatus getMessageCompleteSegment(
            @RequestBody RequestCompleteSegment requestCompleteSegment) {
        routeService.completeSegment(requestCompleteSegment);
        return HttpStatus.ACCEPTED;
    }

    @PostMapping("/road-map/board/location")
    public ResponseBoardLocation getBoardLocation(
            @RequestBody RequestBoardLocation requestBoardLocation) {
        log.info("get board position {}", requestBoardLocation.getBoardId());
        routeService.setLocationForBoard(requestBoardLocation);
        return new ResponseBoardLocation("Status OK");
    }
}
