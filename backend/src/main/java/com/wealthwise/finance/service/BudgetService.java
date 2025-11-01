package com.wealthwise.finance.service;

import com.wealthwise.finance.dto.BudgetDto;
import com.wealthwise.finance.entity.Budget;
import com.wealthwise.finance.entity.User;
import com.wealthwise.finance.exception.ResourceNotFoundException;
import com.wealthwise.finance.repository.BudgetRepository;
import com.wealthwise.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<BudgetDto> getAllBudgetsByUser(Long userId) {
        return budgetRepository.findByUserIdOrderByMonthYearDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetDto getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
        return convertToDto(budget);
    }

    @Transactional
    public BudgetDto createBudget(BudgetDto budgetDto) {
        User user = userRepository.findById(budgetDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + budgetDto.getUserId()));
        
        Budget budget = convertToEntity(budgetDto);
        budget.setUser(user);
        budget.setBalance(budgetDto.getTotalIncome().subtract(budgetDto.getTotalExpenses()));
        
        Budget saved = budgetRepository.save(budget);
        return convertToDto(saved);
    }

    @Transactional
    public BudgetDto updateBudget(Long id, BudgetDto budgetDto) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
        
        budget.setName(budgetDto.getName());
        budget.setTotalIncome(budgetDto.getTotalIncome());
        budget.setTotalExpenses(budgetDto.getTotalExpenses());
        budget.setBalance(budgetDto.getTotalIncome().subtract(budgetDto.getTotalExpenses()));
        budget.setMonthYear(budgetDto.getMonthYear());
        budget.setUpdatedAt(LocalDateTime.now());
        
        Budget updated = budgetRepository.save(budget);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteBudget(Long id) {
        if (!budgetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Budget not found with id: " + id);
        }
        budgetRepository.deleteById(id);
    }

    private BudgetDto convertToDto(Budget budget) {
        BudgetDto dto = new BudgetDto();
        dto.setId(budget.getId());
        dto.setUserId(budget.getUser().getId());
        dto.setName(budget.getName());
        dto.setTotalIncome(budget.getTotalIncome());
        dto.setTotalExpenses(budget.getTotalExpenses());
        dto.setBalance(budget.getBalance());
        dto.setMonthYear(budget.getMonthYear());
        return dto;
    }

    private Budget convertToEntity(BudgetDto dto) {
        Budget budget = new Budget();
        budget.setName(dto.getName());
        budget.setTotalIncome(dto.getTotalIncome());
        budget.setTotalExpenses(dto.getTotalExpenses());
        budget.setMonthYear(dto.getMonthYear());
        return budget;
    }
}
