package com.wealthwise.finance.service;

import com.wealthwise.finance.dto.AssetDto;
import com.wealthwise.finance.entity.Asset;
import com.wealthwise.finance.entity.User;
import com.wealthwise.finance.repository.AssetRepository;
import com.wealthwise.finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    public List<AssetDto> getAssetsByUserId(Long userId) {
        List<Asset> assets = assetRepository.findByUserId(userId);
        return assets.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<AssetDto> getAssetsByUserIdAndType(Long userId, Boolean isAsset) {
        List<Asset> assets = assetRepository.findByUserIdAndIsAsset(userId, isAsset);
        return assets.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public AssetDto getAssetById(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
        return convertToDto(asset);
    }

    public AssetDto createAsset(AssetDto assetDto) {
        User user = userRepository.findById(assetDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + assetDto.getUserId()));

        Asset asset = new Asset();
        asset.setUser(user);
        asset.setName(assetDto.getName());
        asset.setType(assetDto.getType());
        asset.setValue(assetDto.getValue());
        asset.setIsAsset(assetDto.getIsAsset());
        asset.setDescription(assetDto.getDescription());

        Asset savedAsset = assetRepository.save(asset);
        return convertToDto(savedAsset);
    }

    public AssetDto updateAsset(Long id, AssetDto assetDto) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));

        asset.setName(assetDto.getName());
        asset.setType(assetDto.getType());
        asset.setValue(assetDto.getValue());
        asset.setIsAsset(assetDto.getIsAsset());
        asset.setDescription(assetDto.getDescription());

        Asset updatedAsset = assetRepository.save(asset);
        return convertToDto(updatedAsset);
    }

    public void deleteAsset(Long id) {
        if (!assetRepository.existsById(id)) {
            throw new RuntimeException("Asset not found with id: " + id);
        }
        assetRepository.deleteById(id);
    }

    public BigDecimal getTotalAssets(Long userId) {
        BigDecimal total = assetRepository.getTotalAssetsByUserId(userId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalLiabilities(Long userId) {
        BigDecimal total = assetRepository.getTotalLiabilitiesByUserId(userId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getNetWorth(Long userId) {
        BigDecimal assets = getTotalAssets(userId);
        BigDecimal liabilities = getTotalLiabilities(userId);
        return assets.subtract(liabilities);
    }

    private AssetDto convertToDto(Asset asset) {
        return new AssetDto(
                asset.getId(),
                asset.getUser().getId(),
                asset.getName(),
                asset.getType(),
                asset.getValue(),
                asset.getIsAsset(),
                asset.getDescription(),
                asset.getCreatedAt(),
                asset.getUpdatedAt()
        );
    }
}
