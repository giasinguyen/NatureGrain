package com.naturegrain.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CloudinaryImageResponse {
    private Long id;
    private String name;
    private String url;
    private String format;
    private Long size;
    private Integer width;
    private Integer height;
    private LocalDateTime createdAt;
}
