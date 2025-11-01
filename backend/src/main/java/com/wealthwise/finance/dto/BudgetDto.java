package com.wealthwise.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetDto {
    private Long id;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotNull(message = "Total income is required")
    private BigDecimal totalIncome;
    
    @NotNull(message = "Total expenses is required")
    private BigDecimal totalExpenses;
    
    private BigDecimal balance;
    
    @NotNull(message = "Month/Year is required")
    private LocalDate monthYear;
}
