package com.wealthwise.finance.repository;

import com.wealthwise.finance.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserId(Long userId);
    Optional<Budget> findByUserIdAndMonthYear(Long userId, LocalDate monthYear);
    List<Budget> findByUserIdOrderByMonthYearDesc(Long userId);
}
