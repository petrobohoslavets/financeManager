package com.softserve.pfm.service;

import com.softserve.pfm.model.Transactions;

import java.time.LocalDate;
import java.util.List;

public interface TransactionService {
    Transactions getTransactionById(Long id);
    List<Transactions> getAllTransactions();
    List<Transactions> getTransactionsWithCategory(Long categoryId);
    List<Object[]> getReport(String startDate, String endDate, String type);
    List<Object[]> getReportByCategory(String startDate, String endDate, Long categoryId, String type);
    Transactions addTransaction(Long categoryId, String type, double sum, LocalDate date, String description);
    Transactions updateTransaction(Long id, Long categoryId, String type, double sum, LocalDate date, String description);
    void deleteTransactionById(Long id);
}
