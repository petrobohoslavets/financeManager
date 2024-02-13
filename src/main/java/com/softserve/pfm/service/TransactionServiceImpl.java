package com.softserve.pfm.service;

import com.softserve.pfm.model.Category;
import com.softserve.pfm.model.Transactions;
import com.softserve.pfm.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;
    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository, CategoryService categoryService) {
        this.transactionRepository = transactionRepository;
        this.categoryService = categoryService;
    }

    @Override
    public Transactions getTransactionById(Long id) {
        return getTransactionIfExistById(id);
    }

    private Transactions getTransactionIfExistById(Long id) {
        Optional<Transactions> transactionOptional = transactionRepository.findById(id);
        if(transactionOptional.isEmpty()) {
            throw new IllegalStateException("Transaction with id = " + id + "does not exists");
        }
        return transactionOptional.get();
    }

    @Override
    public List<Transactions> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public List<Transactions> getTransactionsWithCategory(Long categoryId) {
        if(categoryId != null) {
            return transactionRepository.transactionsWithCategory(categoryId);
        } else {
            throw new IllegalStateException("Category id can't be null");
        }

    }

    @Override
    public List<Object[]> getReport(String startDate, String endDate, String type) {
        if(!LocalDate.parse(startDate).isBefore(LocalDate.parse(endDate))) return new ArrayList<>();
        else return transactionRepository.getReport(startDate, endDate, type);
    }

    @Override
    public List<Object[]> getReportByCategory(String startDate, String endDate, Long categoryId, String type) {
        if(!LocalDate.parse(startDate).isBefore(LocalDate.parse(endDate))) return new ArrayList<>();
        else return transactionRepository.getReportById(startDate, endDate, categoryId, type);
    }

    @Override
    @Transactional
    public Transactions addTransaction(Long categoryId, String type, double sum, LocalDate date, String description) {
        if(categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            Transactions transactions = new Transactions(category, type, sum, date, description);
            return transactionRepository.save(transactions);
        } else {
            throw new IllegalStateException("Category id can't be null");
        }

    }

    @Override
    @Transactional
    public Transactions updateTransaction(Long id, Long categoryId, String type, double sum, LocalDate date, String description) {
        Transactions transactions = getTransactionById(id);

        if(categoryId != null) {
            Category newCategory = categoryService.getCategoryById(categoryId);
            transactions.setCategory(newCategory);
        } else {
            throw new IllegalStateException("Category id can't be null");
        }
        transactions.setType(type);
        if(sum >= 0) transactions.setSum(sum);
        else throw new IllegalStateException("Sum id can't be negative");
        transactions.setDate(date);
        transactions.setDescription(description);
        return transactionRepository.save(transactions);
    }

    @Override
    @Transactional
    public void deleteTransactionById(Long id) {
        Transactions transactions = getTransactionIfExistById(id);
        transactionRepository.deleteById(id);
    }
}
