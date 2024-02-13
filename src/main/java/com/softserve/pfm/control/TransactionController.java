package com.softserve.pfm.control;

import com.softserve.pfm.model.Transactions;
import com.softserve.pfm.service.TransactionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/transaction")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/")
    public List<Transactions> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public Transactions getTransactionById(@PathVariable("id") Long id) {
        return transactionService.getTransactionById(id);
    }

    @GetMapping("/categoryId={id}")
    public List<Transactions> getTransactionsWithCategory(@PathVariable("id") Long id) {
        return transactionService.getTransactionsWithCategory(id);
    }

    @GetMapping("/report/{startDate}/{endDate}/{type}")
    public List<Object[]> getReport(@PathVariable("startDate") String startDate, @PathVariable("endDate") String endDate, @PathVariable("type") String type) {
        return transactionService.getReport(startDate, endDate, type);
    }
    @GetMapping("/report/{startDate}/{endDate}/{type}/{categoryId}")
    public List<Object[]> getReportByCategory(@PathVariable("startDate") String startDate, @PathVariable("endDate") String endDate, @PathVariable("type") String type, @PathVariable("categoryId") Long categoryId) {
        return transactionService.getReportByCategory(startDate, endDate, categoryId, type);
    }

    @PutMapping("/{categoryId}/{type}/{sum}/{date}/{description}")
    public Transactions createNewTransaction(@PathVariable("categoryId") Long categoryId,
                                             @PathVariable("type") String type,
                                             @PathVariable("sum") Optional<Double> sum,
                                             @PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                             @PathVariable("description") String description) {
        double sumValue = sum.orElse(0.0);
        System.out.println(date);
        return transactionService.addTransaction(categoryId, type, sumValue, date, description);

    }

    @PostMapping("/{id}/{categoryId}/{type}/{sum}/{date}/{description}")
    public Transactions updateTransaction(@PathVariable("id") Long id,
                                          @PathVariable("categoryId") Long categoryId,
                                          @PathVariable("type") String type,
                                          @PathVariable("sum") Optional<Double> sum,
                                          @PathVariable("date")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                          @PathVariable("description") String description) {
        double sumValue = sum.orElse(0.0);
        return transactionService.updateTransaction(id, categoryId, type, sumValue, date, description);
    }

    @DeleteMapping("/{id}")
    public void deleteTransactionById(@PathVariable("id") Long id) {
        transactionService.deleteTransactionById(id);
    }
}
