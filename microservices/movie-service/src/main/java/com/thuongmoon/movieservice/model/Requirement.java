package com.thuongmoon.movieservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "requirement")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Requirement implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    private String id;

    // min 7
    private int screeningsPerWeek;

    // 0 -> Monday ... 6 -> Sunday
    private List<SpecificRequireType> specificRequireTypes = new ArrayList<>();

    private int totalWeekScheduling;

    @Override
    public int hashCode() {
        return 2023;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        return id != null && id.equals(((Requirement) obj).id);
    }
}
