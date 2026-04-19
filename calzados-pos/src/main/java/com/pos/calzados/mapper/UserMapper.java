package com.pos.calzados.mapper;

import com.pos.calzados.dto.response.UserResponse;
import com.pos.calzados.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

    @Mapper(componentModel = "spring")
    public interface UserMapper {

        UserResponse toResponse(User user);

        List<UserResponse> toResponseList(List<User> users);
    }
