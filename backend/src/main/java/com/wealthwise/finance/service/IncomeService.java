package com.wealthwise.finance.service;

import com.wealthwise.finance.dto.IncomeDto;
import com.wealthwise.finance.entity.Income;
import com.wealthwise.finance.entity.User;
import com.wealthwise.finance.exception.ResourceNotFoundException;
import com.wealthwise.finance.repository.IncomeRepository;
import com.wealthwise.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<IncomeDto> getAllIncomeByUser(Long userId) {
        return incomeRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IncomeDto> getIncomeByDateRange(Long userId, LocalDate start, LocalDate end) {
        return incomeRepository.findByUserIdAndIncomeDateBetween(userId, start, end).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IncomeDto getIncomeById(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
        return convertToDto(income);
    }

    @Transactional
    public IncomeDto createIncome(IncomeDto incomeDto) {
        User user = userRepository.findById(incomeDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + incomeDto.getUserId()));
        
        Income income = convertToEntity(incomeDto);
        income.setUser(user);
        Income saved = incomeRepository.save(income);
        return convertToDto(saved);
    }

    @Transactional
    public IncomeDto updateIncome(Long id, IncomeDto incomeDto) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
        
        income.setSource(incomeDto.getSource());
        income.setAmount(incomeDto.getAmount());
        income.setCategory(incomeDto.getCategory());
        income.setIncomeDate(incomeDto.getIncomeDate());
        income.setDescription(incomeDto.getDescription());
        
        Income updated = incomeRepository.save(income);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Income not found with id: " + id);
        }
        incomeRepository.deleteById(id);
    }

    private IncomeDto convertToDto(Income income) {
        IncomeDto dto = new IncomeDto();
        dto.setId(income.getId());
        dto.setUserId(income.getUser().getId());
        dto.setSource(income.getSource());
        dto.setAmount(income.getAmount());
        dto.setCategory(income.getCategory());
        dto.setIncomeDate(income.getIncomeDate());
        dto.setDescription(income.getDescription());
        return dto;
    }

    private Income convertToEntity(IncomeDto dto) {
        Income income = new Income();
        income.setSource(dto.getSource());
        income.setAmount(dto.getAmount());
        income.setCategory(dto.getCategory());
        income.setIncomeDate(dto.getIncomeDate());
        income.setDescription(dto.getDescription());
        return income;
    }
}
