package com.wealthwise.finance.controller;

import com.wealthwise.finance.entity.MonthlyBalance;
import com.wealthwise.finance.entity.User;
import com.wealthwise.finance.service.MonthlyBalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/monthly-balances")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MonthlyBalanceController {
    private final MonthlyBalanceService monthlyBalanceService;

    @GetMapping("/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getMonthlyBalance(
            @PathVariable Integer year,
            @PathVariable Integer month) {
        
        User user = new User();
        user.setId(1L);

        MonthlyBalance balance = monthlyBalanceService.calculateAndSaveMonthlyBalance(user, year, month);
        
        Map<String, Object> response = new HashMap<>();
        response.put("year", balance.getYear());
        response.put("month", balance.getMonth());
        response.put("openingBalance", balance.getOpeningBalance());
        response.put("closingBalance", balance.getClosingBalance());
        response.put("totalIncome", balance.getTotalIncome());
        response.put("totalExpense", balance.getTotalExpense());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projection/{year}/{month}")
    public ResponseEntity<Map<String, Object>> getProjectedBalance(
            @PathVariable Integer year,
            @PathVariable Integer month) {
        
        User user = new User();
        user.setId(1L);

        BigDecimal openingBalance = monthlyBalanceService.getPreviousMonthClosingBalance(user.getId(), year, month);
        BigDecimal projectedClosingBalance = monthlyBalanceService.getProjectedMonthlyBalance(user.getId(), year, month);
        
        Map<String, Object> response = new HashMap<>();
        response.put("year", year);
        response.put("month", month);
        response.put("openingBalance", openingBalance);
        response.put("projectedClosingBalance", projectedClosingBalance);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MonthlyBalance>> getAllMonthlyBalances() {
        User user = new User();
        user.setId(1L);

        List<MonthlyBalance> balances = monthlyBalanceService.getAllMonthlyBalances(user.getId());
        return ResponseEntity.ok(balances);
    }

    @PostMapping("/recalculate/{year}/{month}")
    public ResponseEntity<Map<String, Object>> recalculateMonthlyBalance(
            @PathVariable Integer year,
            @PathVariable Integer month) {
        
        User user = new User();
        user.setId(1L);

        MonthlyBalance balance = monthlyBalanceService.calculateAndSaveMonthlyBalance(user, year, month);
        
        Map<String, Object> response = new HashMap<>();
        response.put("year", balance.getYear());
        response.put("month", balance.getMonth());
        response.put("openingBalance", balance.getOpeningBalance());
        response.put("closingBalance", balance.getClosingBalance());
        response.put("totalIncome", balance.getTotalIncome());
        response.put("totalExpense", balance.getTotalExpense());
        response.put("message", "Monthly balance recalculated successfully");
        
        return ResponseEntity.ok(response);
    }
}
