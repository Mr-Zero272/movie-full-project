package com.thuongmoon.movieservice.request;

import com.thuongmoon.movieservice.model.Movie;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serial;
import java.io.Serializable;

@AllArgsConstructor
@Data
public class AddFileRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private MultipartFile[] files;
    private String type;

    @Override
    public int hashCode() {
        return 2024;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        return type != null && type.equals(((AddFileRequest) obj).type);
    }
}
