package com.wealthwise.finance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.annotations.CreatedDate;
import org.hibernate.annotations.UpdatedTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User ID is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Asset name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Asset type is required")
    @Column(nullable = false)
    private String type; // CAR, PROPERTY, SAVINGS, INVESTMENT, OTHER

    @NotNull(message = "Value is required")
    @Positive(message = "Value must be positive")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal value;

    @NotNull(message = "Asset/Liability classification is required")
    @Column(name = "is_asset", nullable = false)
    private Boolean isAsset; // true = asset, false = liability

    @Column(length = 500)
    private String description;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdatedTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Asset() {
    }

    public Asset(User user, String name, String type, BigDecimal value, Boolean isAsset, String description) {
        this.user = user;
        this.name = name;
        this.type = type;
        this.value = value;
        this.isAsset = isAsset;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public Boolean getIsAsset() {
        return isAsset;
    }

    public void setIsAsset(Boolean isAsset) {
        this.isAsset = isAsset;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
