package com.wealthwise.finance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_balances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "year", "month"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(name = "opening_balance", nullable = false, precision = 12, scale = 2)
    private BigDecimal openingBalance;

    @Column(name = "closing_balance", nullable = false, precision = 12, scale = 2)
    private BigDecimal closingBalance;

    @Column(name = "total_income", precision = 12, scale = 2)
    private BigDecimal totalIncome;

    @Column(name = "total_expense", precision = 12, scale = 2)
    private BigDecimal totalExpense;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
