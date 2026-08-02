package com.shubhvivah;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Login API
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginDetails) {
        Optional<User> user = userRepository.findByEmail(loginDetails.getEmail());

        if (user.isPresent() && user.get().getPassword().equals(loginDetails.getPassword())) {
            return ResponseEntity.ok("Login Successful!");
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    // Register API
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }
        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully!");
    }

    // 1. Get All Profiles (Public Page)
    @GetMapping("/profiles")
    public List<User> getAllPublicProfiles() {
        return userRepository.findAll();
    }

    // 2. Get All Registered Applicants (Owner Dashboard)
    @GetMapping("/admin/users")
    public List<User> getAdminUserData() {
        return userRepository.findAll();
    }

    // 3. Search API (Bulletproof Implementation)
    // 3. Search API (Bulletproof Implementation)
    @GetMapping("/search")
    public List<User> searchUsers(
            @RequestParam(name = "gender", required = false, defaultValue = "") String gender,
            @RequestParam(name = "city", required = false, defaultValue = "") String city) {

        try {
            List<User> allUsers = userRepository.findAll();
            if (allUsers == null) return java.util.Collections.emptyList();

            String targetGender = (gender != null) ? gender.trim() : "";
            if ("Bride".equalsIgnoreCase(targetGender)) targetGender = "Female";
            if ("Groom".equalsIgnoreCase(targetGender)) targetGender = "Male";

            final String filterGender = targetGender;
            final String filterCity = (city != null) ? city.trim() : "";

            return allUsers.stream()
                    .filter(u -> u != null)
                    .filter(u -> filterGender.isEmpty() || 
                        (u.getGender() != null && u.getGender().equalsIgnoreCase(filterGender)))
                    .filter(u -> filterCity.isEmpty() || 
                        (u.getCity() != null && u.getCity().equalsIgnoreCase(filterCity)))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            System.err.println("Search error: " + e.getMessage());
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }
}