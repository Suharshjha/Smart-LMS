package com.example.LMS.Controller;

import com.example.LMS.Dto.Response.AdminBookDto;
import com.example.LMS.Models.Books;
import com.example.LMS.Models.DashboardStats;
import com.example.LMS.Models.IssuedBook;
import com.example.LMS.Models.User;
import com.example.LMS.Repository.BooksRepository;
import com.example.LMS.Repository.IssuedBookRepository;
import com.example.LMS.Repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final BooksRepository booksRepository;
    private final IssuedBookRepository issuedBookRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository,
                           BooksRepository booksRepository,
                           IssuedBookRepository issuedBookRepository,
                           PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.booksRepository = booksRepository;
        this.issuedBookRepository = issuedBookRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ------------------------------------------
    // ADMIN: ADD USER
    // ------------------------------------------
    @PostMapping("/add-user")
    public ResponseEntity<String> addUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User Added Successfully");
    }

    @GetMapping("/all-users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }


    // ============================================================
    //  REPORT 1: CURRENTLY ISSUED BOOKS
    // ============================================================
//    @GetMapping("/reports/issued")
//    public ResponseEntity<List<Map<String, Object>>> getIssuedBooks() {
//
//        List<Map<String, Object>> report = issuedBookRepository.findAll().stream()
//                .filter(i -> i.getStatus() == IssuedBook.Status.APPROVED ||
//                        i.getStatus() == IssuedBook.Status.RENEWAL_APPROVED)
//                .map(i -> {
//                    Map<String, Object> m = new HashMap<>();
//                    m.put("bookTitle", i.getBook().getBookName());
//                    m.put("userName", i.getUser().getUsername());
//                    m.put("issueDate", i.getIssueDate().toString());
//                    m.put("dueDate", i.getDueDate().toString());
//                    return m;
//                })
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(report);
//    }
    @GetMapping("/all-books")
    public ResponseEntity<List<AdminBookDto>> getAllBooksForAdmin() {
        List<Books> books = booksRepository.findAll();

        List<AdminBookDto> dtoList = books.stream().map(book -> {
            AdminBookDto dto = new AdminBookDto();
            dto.setId(book.getBookId());
            dto.setBookName(book.getBookName());
            dto.setAuthorName(book.getAuthorName());
            dto.setCategory(book.getBookCategory());
            dto.setNumberOfCopies(book.getNumberOfCopies());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtoList);
    }



    // ============================================================
    //  REPORT 2: OVERDUE BOOKS
    // ============================================================
    @GetMapping("/reports/overdue")
    public ResponseEntity<List<Map<String, Object>>> getOverdueBooks() {

        LocalDate today = LocalDate.now();

        List<Map<String, Object>> report = issuedBookRepository.findAll().stream()
                .filter(i -> (i.getStatus() == IssuedBook.Status.APPROVED ||
                        i.getStatus() == IssuedBook.Status.RENEWAL_APPROVED)
                        && i.getDueDate().isBefore(today))
                .map(i -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("bookTitle", i.getBook().getBookName());
                    m.put("userName", i.getUser().getUsername());
                    m.put("issueDate", i.getIssueDate().toString());
                    m.put("dueDate", i.getDueDate().toString());
                    long overdueDays = ChronoUnit.DAYS.between(i.getDueDate(), today);
                    m.put("daysOverdue", overdueDays);
                    return m;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(report);
    }

    // ============================================================
    //  REPORT 3: POPULAR BOOKS (Based on issue count)
    // ============================================================
    @GetMapping("/reports/popular")
    public ResponseEntity<List<Map<String, Object>>> getPopularBooks() {

        List<Map<String, Object>> report = booksRepository.findAll().stream()
                .sorted((a, b) -> b.getPopularityScore() - a.getPopularityScore())
                .limit(10)
                .map(b -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("title", b.getBookName());
                    m.put("author", b.getAuthorName());
                    m.put("issueCount", b.getPopularityScore());
                    return m;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(report);
    }

    // ============================================================
    // DASHBOARD STATS
    // ============================================================
    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {

        long totalUsers = userRepository.count();
        long totalBooks = booksRepository.count();

        long issuedBooks = issuedBookRepository.countByStatus(IssuedBook.Status.APPROVED)
                + issuedBookRepository.countByStatus(IssuedBook.Status.RENEWAL_APPROVED);

        long overdueBooks = issuedBookRepository.findAll().stream()
                .filter(i -> (i.getStatus() == IssuedBook.Status.APPROVED ||
                        i.getStatus() == IssuedBook.Status.RENEWAL_APPROVED)
                        && i.getDueDate().isBefore(LocalDate.now()))
                .count();

        DashboardStats stats = new DashboardStats(totalUsers, totalBooks, issuedBooks, overdueBooks);

        return ResponseEntity.ok(stats);
    }
}

