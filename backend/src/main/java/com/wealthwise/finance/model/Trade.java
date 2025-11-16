package com.wealthwise.finance.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trades")
public class Trade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @NotBlank
    @Column(name = "asset_name", nullable = false, length = 100)
    private String assetName;
    
    @NotBlank
    @Column(name = "order_type", nullable = false, length = 10)
    private String orderType;
    
    @NotNull
    @Column(name = "entry_price", nullable = false, precision = 18, scale = 8)
    private BigDecimal entryPrice;
    
    @NotNull
    @Column(name = "exit_price", nullable = false, precision = 18, scale = 8)
    private BigDecimal exitPrice;
    
    @NotNull
    @Column(name = "profit_loss", nullable = false, precision = 12, scale = 2)
    private BigDecimal profitLoss;
    
    @NotNull
    @Column(name = "open_time", nullable = false)
    private LocalDateTime openTime;
    
    @NotNull
    @Column(name = "close_time", nullable = false)
    private LocalDateTime closeTime;
    
    @NotNull
    @Column(name = "trade_date", nullable = false)
    private LocalDate tradeDate;
    
    @NotNull
    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;
    
    @Column(name = "session", length = 50)
    private String session;
    
    @Column(name = "strategy_tag", length = 100)
    private String strategyTag;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public Trade() {}
    
    public Trade(Long userId, String assetName, String orderType, BigDecimal entryPrice,
                 BigDecimal exitPrice, BigDecimal profitLoss, LocalDateTime openTime,
                 LocalDateTime closeTime, LocalDate tradeDate, Integer durationMinutes,
                 String session, String strategyTag) {
        this.userId = userId;
        this.assetName = assetName;
        this.orderType = orderType;
        this.entryPrice = entryPrice;
        this.exitPrice = exitPrice;
        this.profitLoss = profitLoss;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.tradeDate = tradeDate;
        this.durationMinutes = durationMinutes;
        this.session = session;
        this.strategyTag = strategyTag;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getAssetName() {
        return assetName;
    }
    
    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }
    
    public String getOrderType() {
        return orderType;
    }
    
    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }
    
    public BigDecimal getEntryPrice() {
        return entryPrice;
    }
    
    public void setEntryPrice(BigDecimal entryPrice) {
        this.entryPrice = entryPrice;
    }
    
    public BigDecimal getExitPrice() {
        return exitPrice;
    }
    
    public void setExitPrice(BigDecimal exitPrice) {
        this.exitPrice = exitPrice;
    }
    
    public BigDecimal getProfitLoss() {
        return profitLoss;
    }
    
    public void setProfitLoss(BigDecimal profitLoss) {
        this.profitLoss = profitLoss;
    }
    
    public LocalDateTime getOpenTime() {
        return openTime;
    }
    
    public void setOpenTime(LocalDateTime openTime) {
        this.openTime = openTime;
    }
    
    public LocalDateTime getCloseTime() {
        return closeTime;
    }
    
    public void setCloseTime(LocalDateTime closeTime) {
        this.closeTime = closeTime;
    }
    
    public LocalDate getTradeDate() {
        return tradeDate;
    }
    
    public void setTradeDate(LocalDate tradeDate) {
        this.tradeDate = tradeDate;
    }
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public String getSession() {
        return session;
    }
    
    public void setSession(String session) {
        this.session = session;
    }
    
    public String getStrategyTag() {
        return strategyTag;
    }
    
    public void setStrategyTag(String strategyTag) {
        this.strategyTag = strategyTag;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
