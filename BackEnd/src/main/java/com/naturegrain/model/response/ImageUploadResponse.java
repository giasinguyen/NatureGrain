package com.naturegrain.model.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageUploadResponse {
    private String message;
    private List<Long> imageIds;
    private List<String> imageNames;
}
