package com.wealthwise.finance.controller;

import com.wealthwise.finance.dto.RecurringTransactionDto;
import com.wealthwise.finance.service.RecurringTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recurring")
@RequiredArgsConstructor
public class RecurringTransactionController {
    private final RecurringTransactionService recurringTransactionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecurringTransactionDto>> getAllByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(recurringTransactionService.getAllByUser(userId));
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<RecurringTransactionDto>> getActiveByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(recurringTransactionService.getActiveByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecurringTransactionDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(recurringTransactionService.getById(id));
    }

    @PostMapping
    public ResponseEntity<RecurringTransactionDto> create(@Valid @RequestBody RecurringTransactionDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recurringTransactionService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringTransactionDto> update(@PathVariable Long id, @Valid @RequestBody RecurringTransactionDto dto) {
        return ResponseEntity.ok(recurringTransactionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recurringTransactionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/generate/{year}/{month}")
    public ResponseEntity<List<Map<String, Object>>> generateInstances(
            @PathVariable Long userId,
            @PathVariable int year,
            @PathVariable int month) {
        return ResponseEntity.ok(recurringTransactionService.generateInstances(userId, year, month));
    }
}
