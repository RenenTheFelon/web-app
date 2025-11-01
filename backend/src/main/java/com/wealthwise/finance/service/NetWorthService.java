package com.wealthwise.finance.service;

import com.wealthwise.finance.dto.NetWorthDto;
import com.wealthwise.finance.entity.NetWorth;
import com.wealthwise.finance.entity.User;
import com.wealthwise.finance.exception.ResourceNotFoundException;
import com.wealthwise.finance.repository.NetWorthRepository;
import com.wealthwise.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NetWorthService {
    private final NetWorthRepository netWorthRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NetWorthDto> getAllNetWorthByUser(Long userId) {
        return netWorthRepository.findByUserIdOrderByRecordDateDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NetWorthDto getNetWorthById(Long id) {
        NetWorth netWorth = netWorthRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Net Worth record not found with id: " + id));
        return convertToDto(netWorth);
    }

    @Transactional
    public NetWorthDto createNetWorth(NetWorthDto netWorthDto) {
        User user = userRepository.findById(netWorthDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + netWorthDto.getUserId()));
        
        NetWorth netWorth = convertToEntity(netWorthDto);
        netWorth.setUser(user);
        netWorth.setNetWorth(netWorthDto.getTotalAssets().subtract(netWorthDto.getTotalLiabilities()));
        
        NetWorth saved = netWorthRepository.save(netWorth);
        return convertToDto(saved);
    }

    @Transactional
    public NetWorthDto updateNetWorth(Long id, NetWorthDto netWorthDto) {
        NetWorth netWorth = netWorthRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Net Worth record not found with id: " + id));
        
        netWorth.setTotalAssets(netWorthDto.getTotalAssets());
        netWorth.setTotalLiabilities(netWorthDto.getTotalLiabilities());
        netWorth.setNetWorth(netWorthDto.getTotalAssets().subtract(netWorthDto.getTotalLiabilities()));
        netWorth.setRecordDate(netWorthDto.getRecordDate());
        netWorth.setAssetsBreakdown(netWorthDto.getAssetsBreakdown());
        netWorth.setLiabilitiesBreakdown(netWorthDto.getLiabilitiesBreakdown());
        
        NetWorth updated = netWorthRepository.save(netWorth);
        return convertToDto(updated);
    }

    @Transactional
    public void deleteNetWorth(Long id) {
        if (!netWorthRepository.existsById(id)) {
            throw new ResourceNotFoundException("Net Worth record not found with id: " + id);
        }
        netWorthRepository.deleteById(id);
    }

    private NetWorthDto convertToDto(NetWorth netWorth) {
        NetWorthDto dto = new NetWorthDto();
        dto.setId(netWorth.getId());
        dto.setUserId(netWorth.getUser().getId());
        dto.setTotalAssets(netWorth.getTotalAssets());
        dto.setTotalLiabilities(netWorth.getTotalLiabilities());
        dto.setNetWorth(netWorth.getNetWorth());
        dto.setRecordDate(netWorth.getRecordDate());
        dto.setAssetsBreakdown(netWorth.getAssetsBreakdown());
        dto.setLiabilitiesBreakdown(netWorth.getLiabilitiesBreakdown());
        return dto;
    }

    private NetWorth convertToEntity(NetWorthDto dto) {
        NetWorth netWorth = new NetWorth();
        netWorth.setTotalAssets(dto.getTotalAssets());
        netWorth.setTotalLiabilities(dto.getTotalLiabilities());
        netWorth.setRecordDate(dto.getRecordDate());
        netWorth.setAssetsBreakdown(dto.getAssetsBreakdown());
        netWorth.setLiabilitiesBreakdown(dto.getLiabilitiesBreakdown());
        return netWorth;
    }
}
