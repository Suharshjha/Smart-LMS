package com.example.LMS.Config;

import com.example.LMS.Models.User;
import com.example.LMS.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminUsername = "admin";
        String adminEmail = "admin@example.com";
        String rawPassword = "Admin@123";

        // only create if not present
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setRole("ADMIN");                     // be consistent with your role handling
            admin.setPassword(passwordEncoder.encode(rawPassword)); // hashed

            userRepository.save(admin);
            logger.info("Created default admin user: {}", adminUsername);
        } else {
            logger.info("Admin user already exists, skipping creation");
        }
    }
}
