package com.montivero.poc.websocket.prizes.controller;

import com.montivero.poc.websocket.prizes.domain.Prize;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
public class CreatePrizeController {

    private List<Prize> prizeList = new ArrayList<>();

    @MessageMapping("/new-prize")
    @SendTo("/prize-list")
    public List<Prize> createPrize(Prize prize) {
        prizeList.add(prize);
        return prizeList;
    }

    @MessageMapping("/remove-prize")
    @SendTo("/prize-list")
    public List<Prize> removePrize(Prize prize) {
        prizeList.remove(prize);
        System.out.println(prize);
        System.out.println(prizeList);
        return prizeList;
    }

    @MessageMapping("/init-prize")
    @SendTo("/prize-list")
    public List<Prize> currentPrizes() {
        return prizeList;
    }

}
