package com.softserve.pfm.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
@Entity
@Table
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Transactions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    private String type;
    private double sum;
    private LocalDate date;
    private String description;

    public Transactions(Category category, String type, double sum, LocalDate date, String description) {
        this.category = category;
        this.type = type;
        this.sum = sum;
        this.date = date;
        this.description = description;
    }
}
