package com.wealthwise.finance.service;

import com.wealthwise.finance.dto.ExpenseDto;
import com.wealthwise.finance.entity.Expense;
import com.wealthwise.finance.entity.User;
import com.wealthwise.finance.exception.ResourceNotFoundException;
import com.wealthwise.finance.repository.ExpenseRepository;
import com.wealthwise.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ExpenseDto> getAllExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExpenseDto> getExpensesByDateRange(Long userId, LocalDate start, LocalDate end) {
        return expenseRepository.findByUserIdAndExpenseDateBetween(userId, start, end).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExpenseDto getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return convertToDto(expense);
    }

    @Transactional
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        User user = userRepository.findById(expenseDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + expenseDto.getUserId()));
        
        Expense expense = convertToEntity(expenseDto);
        expense.setUser(user);
        Expense saved = expenseRepository.save(expense);
        return convertToDto(saved);
    }

    @Transactional
    public ExpenseDto updateExpense(Long id, ExpenseDto expenseDto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        
        expense.setName(expenseDto.getName());
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setExpenseDate(expenseDto.getExpenseDate());
        expense.setDescription(expenseDto.getDescription());
        
        Expense updated = expenseRepository.save(expense);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }

    private ExpenseDto convertToDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setUserId(expense.getUser().getId());
        dto.setName(expense.getName());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setExpenseDate(expense.getExpenseDate());
        dto.setDescription(expense.getDescription());
        return dto;
    }

    private Expense convertToEntity(ExpenseDto dto) {
        Expense expense = new Expense();
        expense.setName(dto.getName());
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory());
        expense.setExpenseDate(dto.getExpenseDate());
        expense.setDescription(dto.getDescription());
        return expense;
    }
}
