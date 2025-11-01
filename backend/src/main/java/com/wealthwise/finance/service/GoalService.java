package com.wealthwise.finance.service;

import com.wealthwise.finance.dto.GoalDto;
import com.wealthwise.finance.entity.Goal;
import com.wealthwise.finance.entity.User;
import com.wealthwise.finance.exception.ResourceNotFoundException;
import com.wealthwise.finance.repository.GoalRepository;
import com.wealthwise.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<GoalDto> getAllGoalsByUser(Long userId) {
        return goalRepository.findByUserIdOrderByTargetDateAsc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GoalDto getGoalById(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
        return convertToDto(goal);
    }

    @Transactional
    public GoalDto createGoal(GoalDto goalDto) {
        User user = userRepository.findById(goalDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + goalDto.getUserId()));
        
        Goal goal = convertToEntity(goalDto);
        goal.setUser(user);
        
        Goal saved = goalRepository.save(goal);
        return convertToDto(saved);
    }

    @Transactional
    public GoalDto updateGoal(Long id, GoalDto goalDto) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
        
        goal.setName(goalDto.getName());
        goal.setTargetAmount(goalDto.getTargetAmount());
        goal.setCurrentAmount(goalDto.getCurrentAmount());
        goal.setTargetDate(goalDto.getTargetDate());
        goal.setDescription(goalDto.getDescription());
        if (goalDto.getStatus() != null) {
            goal.setStatus(Goal.GoalStatus.valueOf(goalDto.getStatus()));
        }
        goal.setUpdatedAt(LocalDateTime.now());
        
        Goal updated = goalRepository.save(goal);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteGoal(Long id) {
        if (!goalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Goal not found with id: " + id);
        }
        goalRepository.deleteById(id);
    }

    private GoalDto convertToDto(Goal goal) {
        GoalDto dto = new GoalDto();
        dto.setId(goal.getId());
        dto.setUserId(goal.getUser().getId());
        dto.setName(goal.getName());
        dto.setTargetAmount(goal.getTargetAmount());
        dto.setCurrentAmount(goal.getCurrentAmount());
        dto.setTargetDate(goal.getTargetDate());
        dto.setDescription(goal.getDescription());
        dto.setStatus(goal.getStatus().name());
        return dto;
    }

    private Goal convertToEntity(GoalDto dto) {
        Goal goal = new Goal();
        goal.setName(dto.getName());
        goal.setTargetAmount(dto.getTargetAmount());
        goal.setCurrentAmount(dto.getCurrentAmount());
        goal.setTargetDate(dto.getTargetDate());
        goal.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            goal.setStatus(Goal.GoalStatus.valueOf(dto.getStatus()));
        }
        return goal;
    }
}
