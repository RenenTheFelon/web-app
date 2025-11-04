package com.wealthwise.finance.repository;

import com.wealthwise.finance.entity.MonthlyBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyBalanceRepository extends JpaRepository<MonthlyBalance, Long> {
    Optional<MonthlyBalance> findByUserIdAndYearAndMonth(Long userId, Integer year, Integer month);
    
    List<MonthlyBalance> findByUserIdOrderByYearDescMonthDesc(Long userId);
    
    @Query("SELECT mb FROM MonthlyBalance mb WHERE mb.user.id = :userId " +
           "AND (mb.year < :year OR (mb.year = :year AND mb.month < :month)) " +
           "ORDER BY mb.year DESC, mb.month DESC")
    Optional<MonthlyBalance> findFirstByUserIdAndYearAndMonthBefore(@Param("userId") Long userId, 
                                                                      @Param("year") Integer year, 
                                                                      @Param("month") Integer month);
}
