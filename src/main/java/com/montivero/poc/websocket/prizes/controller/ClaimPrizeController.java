package com.montivero.poc.websocket.prizes.controller;

import com.montivero.poc.websocket.prizes.domain.Winner;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
public class ClaimPrizeController {

    private List<Winner> winnerList = new ArrayList<>();

    @MessageMapping("/claim")
    @SendTo("/winner-list")
    public List<Winner> selectWinner(Winner winner) {
        winnerList.add(winner);
        return winnerList;
    }

}
