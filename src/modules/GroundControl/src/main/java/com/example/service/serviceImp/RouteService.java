package com.example.service.serviceImp;

import com.example.groundRouteLogic.GraphGround;
import com.example.message.requestMessage.RequestMessageRoadMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final GraphGround graphGround;

    public int[] createRoadMap(RequestMessageRoadMap request) {

        return graphGround.dijkstraAlgorithm(request.getStartPoint(),
                request.getEndPoint());
    }


}
