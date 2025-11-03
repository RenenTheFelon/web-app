package com.wealthwise.finance.service;

import com.wealthwise.finance.dto.RecurringTransactionDto;
import com.wealthwise.finance.entity.RecurringTransaction;
import com.wealthwise.finance.entity.User;
import com.wealthwise.finance.exception.ResourceNotFoundException;
import com.wealthwise.finance.repository.RecurringTransactionRepository;
import com.wealthwise.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecurringTransactionService {
    private final RecurringTransactionRepository recurringTransactionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<RecurringTransactionDto> getAllByUser(Long userId) {
        return recurringTransactionRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecurringTransactionDto> getActiveByUser(Long userId) {
        return recurringTransactionRepository.findByUserIdAndIsActive(userId, true).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecurringTransactionDto getById(Long id) {
        RecurringTransaction recurringTransaction = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found with id: " + id));
        return convertToDto(recurringTransaction);
    }

    @Transactional
    public RecurringTransactionDto create(RecurringTransactionDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
        
        RecurringTransaction recurringTransaction = convertToEntity(dto);
        recurringTransaction.setUser(user);
        RecurringTransaction saved = recurringTransactionRepository.save(recurringTransaction);
        return convertToDto(saved);
    }

    @Transactional
    public RecurringTransactionDto update(Long id, RecurringTransactionDto dto) {
        RecurringTransaction recurringTransaction = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found with id: " + id));
        
        recurringTransaction.setType(dto.getType());
        recurringTransaction.setName(dto.getName());
        recurringTransaction.setAmount(dto.getAmount());
        recurringTransaction.setCategory(dto.getCategory());
        recurringTransaction.setFrequency(dto.getFrequency());
        recurringTransaction.setDayOfMonth(dto.getDayOfMonth());
        recurringTransaction.setStartDate(dto.getStartDate());
        recurringTransaction.setEndDate(dto.getEndDate());
        recurringTransaction.setIsActive(dto.getIsActive());
        recurringTransaction.setDescription(dto.getDescription());
        
        RecurringTransaction updated = recurringTransactionRepository.save(recurringTransaction);
        return convertToDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!recurringTransactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Recurring transaction not found with id: " + id);
        }
        recurringTransactionRepository.deleteById(id);
    }

    public List<Map<String, Object>> generateInstances(Long userId, int year, int month) {
        List<RecurringTransaction> activeTransactions = recurringTransactionRepository.findByUserIdAndIsActive(userId, true);
        List<Map<String, Object>> instances = new ArrayList<>();
        
        YearMonth yearMonth = YearMonth.of(year, month);
        int daysInMonth = yearMonth.lengthOfMonth();
        
        for (RecurringTransaction rt : activeTransactions) {
            if (rt.getFrequency() == RecurringTransaction.Frequency.MONTHLY) {
                LocalDate transactionDate = LocalDate.of(year, month, Math.min(rt.getDayOfMonth(), daysInMonth));
                
                if (!transactionDate.isBefore(rt.getStartDate()) && 
                    (rt.getEndDate() == null || !transactionDate.isAfter(rt.getEndDate()))) {
                    
                    Map<String, Object> instance = new HashMap<>();
                    instance.put("recurringId", rt.getId());
                    instance.put("type", rt.getType().toString());
                    instance.put("name", rt.getName());
                    instance.put("amount", rt.getAmount());
                    instance.put("category", rt.getCategory());
                    instance.put("date", transactionDate.toString());
                    instance.put("description", rt.getDescription());
                    instance.put("isRecurring", true);
                    
                    instances.add(instance);
                }
            }
        }
        
        return instances;
    }

    private RecurringTransactionDto convertToDto(RecurringTransaction entity) {
        RecurringTransactionDto dto = new RecurringTransactionDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setType(entity.getType());
        dto.setName(entity.getName());
        dto.setAmount(entity.getAmount());
        dto.setCategory(entity.getCategory());
        dto.setFrequency(entity.getFrequency());
        dto.setDayOfMonth(entity.getDayOfMonth());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setIsActive(entity.getIsActive());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    private RecurringTransaction convertToEntity(RecurringTransactionDto dto) {
        RecurringTransaction entity = new RecurringTransaction();
        entity.setType(dto.getType());
        entity.setName(dto.getName());
        entity.setAmount(dto.getAmount());
        entity.setCategory(dto.getCategory());
        entity.setFrequency(dto.getFrequency());
        entity.setDayOfMonth(dto.getDayOfMonth());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
