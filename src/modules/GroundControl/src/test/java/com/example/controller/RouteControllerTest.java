package com.example.controller;

import com.example.message.requestMessage.RequestMessageRoadMap;
import com.example.message.responseMessage.ResponseMessageRoadMap;
import com.example.service.serviceImp.RouteServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RouteController.class)
class RouteControllerTest {

    @MockBean
    private RouteServiceImpl routeService;


    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private ObjectMapper objectMapper;


    @Test
    void getRodeMapForVehicles() throws Exception {
        RequestMessageRoadMap request = new RequestMessageRoadMap
                ("Passenger Bus", "PB1", "AP1");
        ResponseMessageRoadMap response = new ResponseMessageRoadMap("PB1", new int[]{12, 2, 1, 4, 8, 14});

        Mockito.when(routeService.createRoadMap(Mockito.any(RequestMessageRoadMap.class)))
                .thenReturn(response);

        mockMvc.perform(post("/ground-control/road-map").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andDo(print());
    }


    @Test
    void getPermissionOnSegment() {
    }

    @Test
    void getMessageCompleteSegment() {
    }

    @Test
    void getBoardLocation() {
    }
}