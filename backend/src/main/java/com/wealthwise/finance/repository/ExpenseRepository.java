package com.wealthwise.finance.repository;

import com.wealthwise.finance.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
    List<Expense> findByUserIdAndExpenseDateBetween(Long userId, LocalDate start, LocalDate end);
    List<Expense> findByUserIdAndIsRecurring(Long userId, Boolean isRecurring);
    List<Expense> findByRecurringTransactionId(Long recurringTransactionId);
    
    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND e.category = :category")
    List<Expense> findByUserIdAndCategory(@Param("userId") Long userId, @Param("category") String category);
}
