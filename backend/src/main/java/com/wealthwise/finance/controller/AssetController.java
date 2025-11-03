package com.wealthwise.finance.controller;

import com.wealthwise.finance.dto.AssetDto;
import com.wealthwise.finance.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    @Autowired
    private AssetService assetService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AssetDto>> getAssetsByUser(@PathVariable Long userId) {
        List<AssetDto> assets = assetService.getAssetsByUserId(userId);
        return ResponseEntity.ok(assets);
    }

    @GetMapping("/user/{userId}/type/{isAsset}")
    public ResponseEntity<List<AssetDto>> getAssetsByType(
            @PathVariable Long userId,
            @PathVariable Boolean isAsset) {
        List<AssetDto> assets = assetService.getAssetsByUserIdAndType(userId, isAsset);
        return ResponseEntity.ok(assets);
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<Map<String, BigDecimal>> getAssetSummary(@PathVariable Long userId) {
        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("totalAssets", assetService.getTotalAssets(userId));
        summary.put("totalLiabilities", assetService.getTotalLiabilities(userId));
        summary.put("netWorth", assetService.getNetWorth(userId));
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetDto> getAssetById(@PathVariable Long id) {
        AssetDto asset = assetService.getAssetById(id);
        return ResponseEntity.ok(asset);
    }

    @PostMapping
    public ResponseEntity<AssetDto> createAsset(@Valid @RequestBody AssetDto assetDto) {
        AssetDto createdAsset = assetService.createAsset(assetDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAsset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetDto> updateAsset(
            @PathVariable Long id,
            @Valid @RequestBody AssetDto assetDto) {
        AssetDto updatedAsset = assetService.updateAsset(id, assetDto);
        return ResponseEntity.ok(updatedAsset);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
}
