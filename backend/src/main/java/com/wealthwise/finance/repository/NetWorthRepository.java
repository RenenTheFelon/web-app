package com.wealthwise.finance.repository;

import com.wealthwise.finance.entity.NetWorth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface NetWorthRepository extends JpaRepository<NetWorth, Long> {
    List<NetWorth> findByUserId(Long userId);
    List<NetWorth> findByUserIdOrderByRecordDateDesc(Long userId);
    List<NetWorth> findByUserIdAndRecordDateBetween(Long userId, LocalDate start, LocalDate end);
}
