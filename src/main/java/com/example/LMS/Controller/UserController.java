package com.example.LMS.Controller;

import com.example.LMS.Dto.Request.IssueRequestDto;
import com.example.LMS.Models.Books;
import com.example.LMS.Dto.Response.IssueResponseDto;
import com.example.LMS.Service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 1️⃣ Search books (by name/category/author)
    @GetMapping("/search")
    public ResponseEntity<List<Books>> searchBooks(@RequestParam String keyword) {
        return ResponseEntity.ok(userService.searchBooks(keyword));
    }

    @GetMapping("/all-books")
    public ResponseEntity<List<Books>> getAllBooks() {
        return ResponseEntity.ok(userService.getAllBooks());
    }


    // 2️⃣ User requests to issue a book
//    @PostMapping("/request-book")
//    public ResponseEntity<IssueResponseDto> requestBook(@RequestBody IssueRequestDto dto) {
//        return ResponseEntity.ok(userService.requestBook(dto));
//    }

    @PostMapping("/request-book")
    public ResponseEntity<IssueResponseDto> requestBook(@RequestBody IssueRequestDto dto) {
        IssueResponseDto response = userService.requestBook(dto);
        return ResponseEntity.ok(response);  // ensure JSON body goes back
    }

    @GetMapping("/my-books")
    public ResponseEntity<Map<String, Object>> myBooks(@RequestParam Long userId) {

        Map<String, Object> result = new HashMap<>();
        result.put("current", userService.getIssuedBooks(userId));
        result.put("history", userService.getHistory(userId));

        return ResponseEntity.ok(result);
    }


    // 3️⃣ Get books issued to this user
    @GetMapping("/issued/{userId}")
    public ResponseEntity<List<IssueResponseDto>> issuedBooks(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getIssuedBooks(userId));
    }

    @PostMapping("/renew/{issueId}")
    public ResponseEntity<IssueResponseDto> renew(@PathVariable Long issueId) {
        return ResponseEntity.ok(userService.requestRenewal(issueId));
    }


}
