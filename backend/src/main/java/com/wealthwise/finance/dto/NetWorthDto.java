package com.wealthwise.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NetWorthDto {
    private Long id;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Total assets is required")
    private BigDecimal totalAssets;
    
    @NotNull(message = "Total liabilities is required")
    private BigDecimal totalLiabilities;
    
    private BigDecimal netWorth;
    
    @NotNull(message = "Record date is required")
    private LocalDate recordDate;
    
    private String assetsBreakdown;
    
    private String liabilitiesBreakdown;
}
