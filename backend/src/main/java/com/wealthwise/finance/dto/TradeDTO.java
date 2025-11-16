package com.wealthwise.finance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TradeDTO {
    
    private Long id;
    
    @NotBlank(message = "Asset name is required")
    private String assetName;
    
    @NotBlank(message = "Order type is required")
    private String orderType;
    
    @NotNull(message = "Entry price is required")
    private BigDecimal entryPrice;
    
    @NotNull(message = "Exit price is required")
    private BigDecimal exitPrice;
    
    @NotNull(message = "Profit/Loss is required")
    private BigDecimal profitLoss;
    
    @NotNull(message = "Open time is required")
    private LocalDateTime openTime;
    
    @NotNull(message = "Close time is required")
    private LocalDateTime closeTime;
    
    private LocalDate tradeDate;
    
    @NotNull(message = "Duration is required")
    private Integer durationMinutes;
    
    private String session;
    
    private String strategyTag;
    
    private LocalDateTime createdAt;
    
    public TradeDTO() {}
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
