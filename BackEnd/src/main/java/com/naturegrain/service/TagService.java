package com.naturegrain.service;

import java.util.List;

import com.naturegrain.entity.Tag;
import com.naturegrain.model.request.CreateTagRequest;

public interface TagService {
    
    List<Tag> getListTag();

    Tag createTag(CreateTagRequest request);

    Tag updateTag(long id,CreateTagRequest request);

    void enableTag(long id);

    void deleleTag(long id);

}
