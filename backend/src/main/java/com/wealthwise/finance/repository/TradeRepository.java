package com.wealthwise.finance.repository;

import com.wealthwise.finance.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    
    List<Trade> findByUserId(Long userId);
    
    List<Trade> findByUserIdOrderByTradeDateDesc(Long userId);
    
    @Query("SELECT t FROM Trade t WHERE t.userId = :userId AND t.tradeDate >= :startDate AND t.tradeDate <= :endDate ORDER BY t.tradeDate DESC")
    List<Trade> findByUserIdAndDateRange(@Param("userId") Long userId, 
                                          @Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.userId = :userId AND t.profitLoss > 0")
    Long countWinningTradesByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.userId = :userId AND t.profitLoss < 0")
    Long countLosingTradesByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(t.profitLoss) FROM Trade t WHERE t.userId = :userId AND t.profitLoss > 0")
    java.math.BigDecimal getTotalProfitByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(t.profitLoss) FROM Trade t WHERE t.userId = :userId AND t.profitLoss < 0")
    java.math.BigDecimal getTotalLossByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.userId = :userId AND t.orderType = 'BUY'")
    Long countBuyOrdersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Trade t WHERE t.userId = :userId AND t.orderType = 'SELL'")
    Long countSellOrdersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT t.assetName, COUNT(t) as tradeCount FROM Trade t WHERE t.userId = :userId GROUP BY t.assetName ORDER BY tradeCount DESC")
    List<Object[]> findMostTradedInstrumentsByUserId(@Param("userId") Long userId);
}
