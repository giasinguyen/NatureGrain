package com.naturegrain.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.naturegrain.entity.Tag;
import com.naturegrain.exception.NotFoundException;
import com.naturegrain.model.request.CreateTagRequest;
import com.naturegrain.repository.TagRepository;
import com.naturegrain.service.TagService;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagRepository tagRepository;

    @Override
    public List<Tag> getListTag() {
        // TODO Auto-generated method stub
        return tagRepository.findAll(Sort.by("id").descending());
    }

    @Override
    public Tag createTag(CreateTagRequest request) {
        Tag tag = new Tag();
        tag.setName(request.getName());
        tag.setEnable(false);
        tagRepository.save(tag);
        return tag;
    }

    @Override
    public Tag updateTag(long id, CreateTagRequest request) {
        // TODO Auto-generated method stub

        Tag tag = tagRepository.findById(id).orElseThrow(()-> new NotFoundException("Not Foud Tag"));
        tag.setName(request.getName());
        tagRepository.save(tag);
        return tag;
    }

    @Override
    public void deleleTag(long id) {
        // TODO Auto-generated method stub
        Tag tag = tagRepository.findById(id).orElseThrow(()-> new NotFoundException("Not Foud Tag"));
        tagRepository.delete(tag);
    }

    @Override
    public void enableTag(long id){
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new NotFoundException("Not Found Tag With Id: " + id));
        if(tag.isEnable()){
            tag.setEnable(false);
        } else{
            tag.setEnable(true);
        }
        tagRepository.save(tag);
    }
    
}
