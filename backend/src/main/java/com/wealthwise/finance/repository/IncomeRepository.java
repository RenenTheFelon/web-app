package com.wealthwise.finance.repository;

import com.wealthwise.finance.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserId(Long userId);
    List<Income> findByUserIdAndIncomeDateBetween(Long userId, LocalDate start, LocalDate end);
    
    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND i.category = :category")
    List<Income> findByUserIdAndCategory(@Param("userId") Long userId, @Param("category") String category);
}
