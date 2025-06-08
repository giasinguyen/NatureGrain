package com.naturegrain.model.request;

import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequest {


    @NotNull(message="Username rỗng")
    @NotEmpty(message="Username rỗng")
    @Size(min=5,max=30,message="Username từ 5-30 ký tự")
    @Schema(description="Username",example="admin",required=true)
    private String username;

    @NotNull(message="Email rỗng")
    @NotEmpty(message="Email rỗng")
    @Size(min =5,max=30, message="Email từ 5-30 ký tự")
    @Email(message="Email không hợp lệ")
    @Schema(description = "Email",example="admin@gmail.com",required=true)
    private String email;    @NotNull(message="Mật khẩu rỗng")
    @NotEmpty(message="Mật khẩu rỗng")
    @Size(min=6,max=30,message="Mật khẩu từ 6-30 ký tự")
    @Schema(description="Mật khẩu",example="123456")
    private String password;

    @Schema(description="Tên", example="Nguyễn")
    private String firstname;

    @Schema(description="Họ", example="Văn A")
    private String lastname;

    @Schema(description="Số điện thoại", example="0123456789")
    private String phone;

    @Schema(description="Địa chỉ", example="123 Đường ABC, Quận 1")
    private String address;

    @Schema(description="Quốc gia", example="Việt Nam")
    private String country;

    @Schema(description="Tỉnh/Thành phố", example="TP.HCM")
    private String state;

    private Set<String> role;
}
