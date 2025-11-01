package com.wealthwise.finance.controller;

import com.wealthwise.finance.dto.IncomeDto;
import com.wealthwise.finance.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/income")
@RequiredArgsConstructor
public class IncomeController {
    private final IncomeService incomeService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<IncomeDto>> getAllIncomeByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(incomeService.getAllIncomeByUser(userId));
    }

    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<IncomeDto>> getIncomeByDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(incomeService.getIncomeByDateRange(userId, start, end));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeDto> getIncomeById(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.getIncomeById(id));
    }

    @PostMapping
    public ResponseEntity<IncomeDto> createIncome(@Valid @RequestBody IncomeDto incomeDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(incomeService.createIncome(incomeDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeDto> updateIncome(@PathVariable Long id, @Valid @RequestBody IncomeDto incomeDto) {
        return ResponseEntity.ok(incomeService.updateIncome(id, incomeDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }
}
