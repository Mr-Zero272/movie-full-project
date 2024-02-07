package com.thuongmoon.movieservice.dto;

import com.thuongmoon.movieservice.model.Screening;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class TestDta implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String a;
    private String b;

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
        return a != null && a.equals(((TestDta) obj).a);
    }
}
