package com.wealthwise.finance.service;

import com.wealthwise.finance.entity.Expense;
import com.wealthwise.finance.entity.Income;
import com.wealthwise.finance.entity.MonthlyBalance;
import com.wealthwise.finance.entity.RecurringTransaction;
import com.wealthwise.finance.entity.User;
import com.wealthwise.finance.repository.ExpenseRepository;
import com.wealthwise.finance.repository.IncomeRepository;
import com.wealthwise.finance.repository.MonthlyBalanceRepository;
import com.wealthwise.finance.repository.RecurringTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MonthlyBalanceService {
    private final MonthlyBalanceRepository monthlyBalanceRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final RecurringTransactionRepository recurringTransactionRepository;

    @Transactional
    public MonthlyBalance calculateAndSaveMonthlyBalance(User user, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Income> incomes = incomeRepository.findByUserIdAndIncomeDateBetween(
            user.getId(), startDate, endDate
        );
        List<Expense> expenses = expenseRepository.findByUserIdAndExpenseDateBetween(
            user.getId(), startDate, endDate
        );

        BigDecimal totalIncome = incomes.stream()
            .map(Income::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal openingBalance = getPreviousMonthClosingBalance(user.getId(), year, month);
        BigDecimal closingBalance = openingBalance.add(totalIncome).subtract(totalExpense);

        Optional<MonthlyBalance> existingBalance = monthlyBalanceRepository
            .findByUserIdAndYearAndMonth(user.getId(), year, month);

        MonthlyBalance monthlyBalance;
        if (existingBalance.isPresent()) {
            monthlyBalance = existingBalance.get();
            monthlyBalance.setOpeningBalance(openingBalance);
            monthlyBalance.setClosingBalance(closingBalance);
            monthlyBalance.setTotalIncome(totalIncome);
            monthlyBalance.setTotalExpense(totalExpense);
            monthlyBalance.setUpdatedAt(LocalDateTime.now());
        } else {
            monthlyBalance = new MonthlyBalance();
            monthlyBalance.setUser(user);
            monthlyBalance.setYear(year);
            monthlyBalance.setMonth(month);
            monthlyBalance.setOpeningBalance(openingBalance);
            monthlyBalance.setClosingBalance(closingBalance);
            monthlyBalance.setTotalIncome(totalIncome);
            monthlyBalance.setTotalExpense(totalExpense);
        }

        return monthlyBalanceRepository.save(monthlyBalance);
    }

    public BigDecimal getPreviousMonthClosingBalance(Long userId, int year, int month) {
        Optional<MonthlyBalance> previousBalance = monthlyBalanceRepository
            .findFirstByUserIdAndYearAndMonthBefore(userId, year, month);
        
        return previousBalance.map(MonthlyBalance::getClosingBalance)
            .orElse(BigDecimal.ZERO);
    }

    public Optional<MonthlyBalance> getMonthlyBalance(Long userId, int year, int month) {
        return monthlyBalanceRepository.findByUserIdAndYearAndMonth(userId, year, month);
    }

    public List<MonthlyBalance> getAllMonthlyBalances(Long userId) {
        return monthlyBalanceRepository.findByUserIdOrderByYearDescMonthDesc(userId);
    }

    public BigDecimal getProjectedMonthlyBalance(Long userId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Income> actualIncomes = incomeRepository.findByUserIdAndIncomeDateBetween(
            userId, startDate, endDate
        );
        List<Expense> actualExpenses = expenseRepository.findByUserIdAndExpenseDateBetween(
            userId, startDate, endDate
        );

        BigDecimal actualIncome = actualIncomes.stream()
            .map(Income::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal actualExpense = actualExpenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<RecurringTransaction> recurringTransactions = recurringTransactionRepository
            .findByUserIdAndIsActive(userId, true);

        BigDecimal projectedRecurringIncome = BigDecimal.ZERO;
        BigDecimal projectedRecurringExpense = BigDecimal.ZERO;

        for (RecurringTransaction rt : recurringTransactions) {
            if (isTransactionInMonth(rt, year, month)) {
                if ("INCOME".equals(rt.getType())) {
                    projectedRecurringIncome = projectedRecurringIncome.add(rt.getAmount());
                } else {
                    projectedRecurringExpense = projectedRecurringExpense.add(rt.getAmount());
                }
            }
        }

        BigDecimal totalIncome = actualIncome.add(projectedRecurringIncome);
        BigDecimal totalExpense = actualExpense.add(projectedRecurringExpense);
        BigDecimal openingBalance = getPreviousMonthClosingBalance(userId, year, month);

        return openingBalance.add(totalIncome).subtract(totalExpense);
    }

    private boolean isTransactionInMonth(RecurringTransaction rt, int year, int month) {
        YearMonth targetMonth = YearMonth.of(year, month);
        YearMonth startMonth = YearMonth.from(rt.getStartDate());
        YearMonth endMonth = rt.getEndDate() != null ? YearMonth.from(rt.getEndDate()) : null;

        if (targetMonth.isBefore(startMonth)) {
            return false;
        }

        if (endMonth != null && targetMonth.isAfter(endMonth)) {
            return false;
        }

        return true;
    }
}
