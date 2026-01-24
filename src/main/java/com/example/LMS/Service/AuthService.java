package com.example.LMS.Service;

import com.example.LMS.Dto.Request.LoginRequest;
import com.example.LMS.Dto.Response.LoginResponse;
import com.example.LMS.Models.User;
import com.example.LMS.Repository.UserRepository;
import com.example.LMS.Security.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {

        try {
            System.out.println("Login step 1: Fetching user...");

            // 1. Find user by username
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Username not found"));

            System.out.println("Login step 2: Checking password...");

            // 2. Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Incorrect password");
            }
//            if (!request.getPassword().equals(user.getPassword())) {
//                throw new RuntimeException("Incorrect password");
//            }

            System.out.println("Login step 3: Preparing JWT...");

            // 3. Get role from DB
            String userRole = user.getRole();

            // 4. Generate token
            String token = jwtUtil.generateToken(user.getUsername(), userRole);

            System.out.println("Login successful!");

            // 5. Send response
            return new LoginResponse(
                    user.getUserId(),
                    token,
                    user.getUsername(),
                    userRole
            );


        } catch (RuntimeException e) {

            System.out.println("Login error: " + e.getMessage());

            // You may want to return a specific response OR rethrow the exception
            throw new RuntimeException("Login failed: " + e.getMessage());
        } catch (Exception e) {

            System.out.println("Unexpected login error: " + e.getMessage());

            throw new RuntimeException("Unexpected error during login");
        }
    }
}
