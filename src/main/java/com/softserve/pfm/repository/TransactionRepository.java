package com.softserve.pfm.repository;

import com.softserve.pfm.model.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transactions, Long> {
    @Query("SELECT t FROM Transactions t WHERE t.category.id = :category_id")
    List<Transactions> transactionsWithCategory(@Param("category_id") Long id);

    @Query(nativeQuery = true,
            value = "SELECT c.name, SUM(t.sum) FROM transactions t " +
                    "JOIN category c ON c.id = t.category_id " +
                    "WHERE t.date BETWEEN :startDate AND :endDate AND t.type = :type " +
                    "GROUP BY t.category_id " +
                    "UNION " +
                    "SELECT 'All', SUM(t.sum) FROM transactions t WHERE t.type = :type " +
                    "AND t.date BETWEEN :startDate AND :endDate")
    List<Object[]> getReport(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("type") String type);
    @Query(nativeQuery = true,
          value = "SELECT t.description, t.sum FROM transactions t " +
                  "WHERE t.date BETWEEN :startDate AND :endDate " +
                  "AND t.category_id = :category_id AND t.type = :type UNION " +
                  "SELECT 'All', sum(t.sum) FROM transactions t WHERE t.category_id = :category_id AND t.type = :type" +
                  " AND t.date BETWEEN :startDate AND :endDate")
    List<Object[]> getReportById(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("category_id") Long categoryId, @Param("type") String type);
}
