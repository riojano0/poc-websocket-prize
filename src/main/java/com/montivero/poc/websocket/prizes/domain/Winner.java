package com.montivero.poc.websocket.prizes.domain;

import lombok.*;

@Data
@NoArgsConstructor
public class Winner {

    private String name;
    private Prize prize;

}
