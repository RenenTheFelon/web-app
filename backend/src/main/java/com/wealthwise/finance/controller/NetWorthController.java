package com.wealthwise.finance.controller;

import com.wealthwise.finance.dto.NetWorthDto;
import com.wealthwise.finance.service.NetWorthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/networth")
@RequiredArgsConstructor
public class NetWorthController {
    private final NetWorthService netWorthService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NetWorthDto>> getAllNetWorthByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(netWorthService.getAllNetWorthByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NetWorthDto> getNetWorthById(@PathVariable Long id) {
        return ResponseEntity.ok(netWorthService.getNetWorthById(id));
    }

    @PostMapping
    public ResponseEntity<NetWorthDto> createNetWorth(@Valid @RequestBody NetWorthDto netWorthDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(netWorthService.createNetWorth(netWorthDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NetWorthDto> updateNetWorth(@PathVariable Long id, @Valid @RequestBody NetWorthDto netWorthDto) {
        return ResponseEntity.ok(netWorthService.updateNetWorth(id, netWorthDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNetWorth(@PathVariable Long id) {
        netWorthService.deleteNetWorth(id);
        return ResponseEntity.noContent().build();
    }
}
