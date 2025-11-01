package com.wealthwise.finance.controller;

import com.wealthwise.finance.dto.BudgetDto;
import com.wealthwise.finance.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BudgetDto>> getAllBudgetsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(budgetService.getAllBudgetsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDto> getBudgetById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @PostMapping
    public ResponseEntity<BudgetDto> createBudget(@Valid @RequestBody BudgetDto budgetDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(budgetService.createBudget(budgetDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDto> updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetDto budgetDto) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budgetDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}
