package com.example.LMS.Controller;

import com.example.LMS.Dto.Request.LoginRequest;
import com.example.LMS.Dto.Response.LoginResponse;
import com.example.LMS.Dto.Request.LoginRequest;
import com.example.LMS.Dto.Response.LoginResponse;
import com.example.LMS.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class Authorization {

    private final AuthService authService;

    public Authorization(AuthService authService) {
        this.authService = authService;
    }

    // LOGIN (ADMIN / LIBRARIAN / USER)
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

}
