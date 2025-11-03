package com.wealthwise.finance.repository;

import com.wealthwise.finance.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    
    List<Asset> findByUserId(Long userId);
    
    List<Asset> findByUserIdAndIsAsset(Long userId, Boolean isAsset);
    
    @Query("SELECT SUM(a.value) FROM Asset a WHERE a.user.id = :userId AND a.isAsset = true")
    BigDecimal getTotalAssetsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(a.value) FROM Asset a WHERE a.user.id = :userId AND a.isAsset = false")
    BigDecimal getTotalLiabilitiesByUserId(@Param("userId") Long userId);
}
