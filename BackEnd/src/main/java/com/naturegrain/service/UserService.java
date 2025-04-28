package com.naturegrain.service;

import com.naturegrain.entity.User;
import com.naturegrain.model.request.ChangePasswordRequest;
import com.naturegrain.model.request.CreateUserRequest;
import com.naturegrain.model.request.UpdateProfileRequest;

public interface UserService {
    
    void register(CreateUserRequest request);


    User getUserByUsername(String username);

    User updateUser(UpdateProfileRequest request);

    void changePassword(ChangePasswordRequest request);

}
