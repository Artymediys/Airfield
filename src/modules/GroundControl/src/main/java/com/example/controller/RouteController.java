package com.example.controller;

import com.example.message.requestMessage.RequestMessageRoadMap;
import com.example.service.serviceImp.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/ground-control")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @PostMapping("/road-map/board")
    public ResponseEntity<int[]> getRodeMapForVechles(
            @RequestBody RequestMessageRoadMap roadCredentials) {

        return new ResponseEntity<>(routeService.createRoadMap(roadCredentials),
                HttpStatus.OK);
    }
}
