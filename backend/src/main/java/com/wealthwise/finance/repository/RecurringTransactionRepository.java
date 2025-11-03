package com.wealthwise.finance.repository;

import com.wealthwise.finance.entity.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {
    List<RecurringTransaction> findByUserId(Long userId);
    List<RecurringTransaction> findByUserIdAndIsActive(Long userId, Boolean isActive);
    
    @Query("SELECT rt FROM RecurringTransaction rt WHERE rt.user.id = :userId AND rt.type = :type AND rt.isActive = true")
    List<RecurringTransaction> findByUserIdAndTypeAndActive(@Param("userId") Long userId, @Param("type") RecurringTransaction.TransactionType type);
}
