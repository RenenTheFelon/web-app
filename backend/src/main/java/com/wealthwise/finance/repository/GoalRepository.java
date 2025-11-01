package com.wealthwise.finance.repository;

import com.wealthwise.finance.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserId(Long userId);
    List<Goal> findByUserIdAndStatus(Long userId, Goal.GoalStatus status);
    List<Goal> findByUserIdOrderByTargetDateAsc(Long userId);
}
