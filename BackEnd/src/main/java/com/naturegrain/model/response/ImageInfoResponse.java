package com.naturegrain.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageInfoResponse {
    private Long id;
    private String name;
    private String type;
    private Long size;
    // We don't include the actual image data here to keep the response light
}
