package com.wealthwise.finance.controller;

import com.wealthwise.finance.dto.TradeDTO;
import com.wealthwise.finance.service.TradeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = "*")
public class TradeController {
    
    @Autowired
    private TradeService tradeService;
    
    private static final Long DEFAULT_USER_ID = 1L;
    
    @PostMapping
    public ResponseEntity<TradeDTO> createTrade(@Valid @RequestBody TradeDTO tradeDTO) {
        TradeDTO createdTrade = tradeService.createTrade(tradeDTO, DEFAULT_USER_ID);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrade);
    }
    
    @GetMapping
    public ResponseEntity<List<TradeDTO>> getAllTrades() {
        List<TradeDTO> trades = tradeService.getAllTradesByUserId(DEFAULT_USER_ID);
        return ResponseEntity.ok(trades);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TradeDTO> getTradeById(@PathVariable Long id) {
        TradeDTO trade = tradeService.getTradeById(id, DEFAULT_USER_ID);
        return ResponseEntity.ok(trade);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TradeDTO> updateTrade(@PathVariable Long id, @Valid @RequestBody TradeDTO tradeDTO) {
        TradeDTO updatedTrade = tradeService.updateTrade(id, tradeDTO, DEFAULT_USER_ID);
        return ResponseEntity.ok(updatedTrade);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrade(@PathVariable Long id) {
        tradeService.deleteTrade(id, DEFAULT_USER_ID);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<TradeDTO>> getTradesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TradeDTO> trades = tradeService.getTradesByDateRange(DEFAULT_USER_ID, startDate, endDate);
        return ResponseEntity.ok(trades);
    }
    
    @GetMapping("/analytics/behavioral-bias")
    public ResponseEntity<Map<String, Object>> getBehavioralBias() {
        Map<String, Object> bias = tradeService.getBehavioralBias(DEFAULT_USER_ID);
        return ResponseEntity.ok(bias);
    }
    
    @GetMapping("/analytics/profitability")
    public ResponseEntity<Map<String, Object>> getProfitabilityStats() {
        Map<String, Object> stats = tradeService.getProfitabilityStats(DEFAULT_USER_ID);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/analytics/most-traded")
    public ResponseEntity<List<Map<String, Object>>> getMostTradedInstruments(
            @RequestParam(defaultValue = "3") int limit) {
        List<Map<String, Object>> instruments = tradeService.getMostTradedInstruments(DEFAULT_USER_ID, limit);
        return ResponseEntity.ok(instruments);
    }
    
    @GetMapping("/analytics/trading-day-performance")
    public ResponseEntity<Map<String, BigDecimal>> getTradingDayPerformance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, BigDecimal> performance = tradeService.getTradingDayPerformance(DEFAULT_USER_ID, startDate, endDate);
        return ResponseEntity.ok(performance);
    }
}
