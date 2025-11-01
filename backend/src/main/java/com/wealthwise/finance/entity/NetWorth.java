package com.wealthwise.finance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "net_worth")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NetWorth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAssets;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalLiabilities;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal netWorth;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(length = 1000)
    private String assetsBreakdown;

    @Column(length = 1000)
    private String liabilitiesBreakdown;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
