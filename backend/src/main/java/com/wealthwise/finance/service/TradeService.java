package com.wealthwise.finance.service;

import com.wealthwise.finance.dto.TradeDTO;
import com.wealthwise.finance.model.Trade;
import com.wealthwise.finance.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TradeService {
    
    @Autowired
    private TradeRepository tradeRepository;
    
    private String detectSession(LocalDateTime openTime) {
        int hour = openTime.atZone(ZoneOffset.UTC).getHour();
        
        if (hour >= 12 && hour < 21) {
            return "New York";
        } else if (hour >= 7 && hour < 16) {
            return "London";
        } else if (hour >= 0 && hour < 9) {
            return "Asia";
        } else {
            return "After Hours";
        }
    }
    
    @Transactional
    public TradeDTO createTrade(TradeDTO tradeDTO, Long userId) {
        Trade trade = new Trade();
        trade.setUserId(userId);
        trade.setAssetName(tradeDTO.getAssetName());
        trade.setOrderType(tradeDTO.getOrderType().toUpperCase());
        trade.setEntryPrice(tradeDTO.getEntryPrice());
        trade.setExitPrice(tradeDTO.getExitPrice());
        trade.setProfitLoss(tradeDTO.getProfitLoss());
        trade.setOpenTime(tradeDTO.getOpenTime());
        trade.setCloseTime(tradeDTO.getCloseTime());
        trade.setTradeDate(tradeDTO.getCloseTime().toLocalDate());
        trade.setDurationMinutes(tradeDTO.getDurationMinutes());
        trade.setSession(detectSession(tradeDTO.getOpenTime()));
        trade.setStrategyTag(tradeDTO.getStrategyTag());
        
        Trade savedTrade = tradeRepository.save(trade);
        return convertToDTO(savedTrade);
    }
    
    public List<TradeDTO> getAllTradesByUserId(Long userId) {
        return tradeRepository.findByUserIdOrderByTradeDateDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TradeDTO getTradeById(Long id, Long userId) {
        Trade trade = tradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade not found"));
        
        if (!trade.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to trade");
        }
        
        return convertToDTO(trade);
    }
    
    @Transactional
    public TradeDTO updateTrade(Long id, TradeDTO tradeDTO, Long userId) {
        Trade trade = tradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade not found"));
        
        if (!trade.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to trade");
        }
        
        trade.setAssetName(tradeDTO.getAssetName());
        trade.setOrderType(tradeDTO.getOrderType().toUpperCase());
        trade.setEntryPrice(tradeDTO.getEntryPrice());
        trade.setExitPrice(tradeDTO.getExitPrice());
        trade.setProfitLoss(tradeDTO.getProfitLoss());
        trade.setOpenTime(tradeDTO.getOpenTime());
        trade.setCloseTime(tradeDTO.getCloseTime());
        trade.setTradeDate(tradeDTO.getCloseTime().toLocalDate());
        trade.setDurationMinutes(tradeDTO.getDurationMinutes());
        trade.setSession(detectSession(tradeDTO.getOpenTime()));
        trade.setStrategyTag(tradeDTO.getStrategyTag());
        
        Trade updatedTrade = tradeRepository.save(trade);
        return convertToDTO(updatedTrade);
    }
    
    @Transactional
    public void deleteTrade(Long id, Long userId) {
        Trade trade = tradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade not found"));
        
        if (!trade.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to trade");
        }
        
        tradeRepository.delete(trade);
    }
    
    public List<TradeDTO> getTradesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return tradeRepository.findByUserIdAndDateRange(userId, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Map<String, Object> getBehavioralBias(Long userId) {
        Long buyCount = tradeRepository.countBuyOrdersByUserId(userId);
        Long sellCount = tradeRepository.countSellOrdersByUserId(userId);
        Long totalCount = buyCount + sellCount;
        
        Map<String, Object> result = new HashMap<>();
        if (totalCount == 0) {
            result.put("buyCount", 0);
            result.put("sellCount", 0);
            result.put("buyPercentage", 0.0);
            result.put("sellPercentage", 0.0);
            result.put("bias", "NEUTRAL");
        } else {
            double buyPercentage = (buyCount * 100.0) / totalCount;
            double sellPercentage = (sellCount * 100.0) / totalCount;
            
            String bias;
            if (buyPercentage > 55) {
                bias = "RATHER_BULL";
            } else if (sellPercentage > 55) {
                bias = "RATHER_BEAR";
            } else {
                bias = "NEUTRAL";
            }
            
            result.put("buyCount", buyCount);
            result.put("sellCount", sellCount);
            result.put("buyPercentage", Math.round(buyPercentage * 10) / 10.0);
            result.put("sellPercentage", Math.round(sellPercentage * 10) / 10.0);
            result.put("bias", bias);
            result.put("totalTrades", totalCount);
        }
        
        return result;
    }
    
    public Map<String, Object> getProfitabilityStats(Long userId) {
        Long winCount = tradeRepository.countWinningTradesByUserId(userId);
        Long lossCount = tradeRepository.countLosingTradesByUserId(userId);
        Long totalCount = winCount + lossCount;
        
        BigDecimal totalProfit = tradeRepository.getTotalProfitByUserId(userId);
        BigDecimal totalLoss = tradeRepository.getTotalLossByUserId(userId);
        
        if (totalProfit == null) totalProfit = BigDecimal.ZERO;
        if (totalLoss == null) totalLoss = BigDecimal.ZERO;
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalTrades", totalCount);
        result.put("winningTrades", winCount);
        result.put("losingTrades", lossCount);
        result.put("totalProfit", totalProfit);
        result.put("totalLoss", totalLoss.abs());
        result.put("netProfitLoss", totalProfit.add(totalLoss));
        
        if (totalCount > 0) {
            double winRate = (winCount * 100.0) / totalCount;
            double lossRate = (lossCount * 100.0) / totalCount;
            result.put("winRate", Math.round(winRate * 10) / 10.0);
            result.put("lossRate", Math.round(lossRate * 10) / 10.0);
        } else {
            result.put("winRate", 0.0);
            result.put("lossRate", 0.0);
        }
        
        return result;
    }
    
    public List<Map<String, Object>> getMostTradedInstruments(Long userId, int limit) {
        List<Trade> allTrades = tradeRepository.findByUserId(userId);
        
        Map<String, Map<String, Object>> instrumentStats = new HashMap<>();
        
        for (Trade trade : allTrades) {
            String asset = trade.getAssetName();
            instrumentStats.putIfAbsent(asset, new HashMap<>());
            Map<String, Object> stats = instrumentStats.get(asset);
            
            int totalCount = (int) stats.getOrDefault("totalCount", 0);
            int winCount = (int) stats.getOrDefault("winCount", 0);
            int lossCount = (int) stats.getOrDefault("lossCount", 0);
            
            totalCount++;
            if (trade.getProfitLoss().compareTo(BigDecimal.ZERO) > 0) {
                winCount++;
            } else if (trade.getProfitLoss().compareTo(BigDecimal.ZERO) < 0) {
                lossCount++;
            }
            
            stats.put("assetName", asset);
            stats.put("totalCount", totalCount);
            stats.put("winCount", winCount);
            stats.put("lossCount", lossCount);
        }
        
        return instrumentStats.values().stream()
                .sorted((a, b) -> Integer.compare((int) b.get("totalCount"), (int) a.get("totalCount")))
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    public Map<String, BigDecimal> getTradingDayPerformance(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Trade> trades = tradeRepository.findByUserIdAndDateRange(userId, startDate, endDate);
        
        Map<String, BigDecimal> dailyPerformance = new HashMap<>();
        
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            dailyPerformance.put(date.toString(), BigDecimal.ZERO);
        }
        
        for (Trade trade : trades) {
            String dateKey = trade.getTradeDate().toString();
            BigDecimal currentPL = dailyPerformance.getOrDefault(dateKey, BigDecimal.ZERO);
            dailyPerformance.put(dateKey, currentPL.add(trade.getProfitLoss()));
        }
        
        return dailyPerformance;
    }
    
    private TradeDTO convertToDTO(Trade trade) {
        TradeDTO dto = new TradeDTO();
        dto.setId(trade.getId());
        dto.setAssetName(trade.getAssetName());
        dto.setOrderType(trade.getOrderType());
        dto.setEntryPrice(trade.getEntryPrice());
        dto.setExitPrice(trade.getExitPrice());
        dto.setProfitLoss(trade.getProfitLoss());
        dto.setOpenTime(trade.getOpenTime());
        dto.setCloseTime(trade.getCloseTime());
        dto.setTradeDate(trade.getTradeDate());
        dto.setDurationMinutes(trade.getDurationMinutes());
        dto.setSession(trade.getSession());
        dto.setStrategyTag(trade.getStrategyTag());
        dto.setCreatedAt(trade.getCreatedAt());
        return dto;
    }
}
