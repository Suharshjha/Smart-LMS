package com.example.LMS.Controller;

import com.example.LMS.Dto.Request.AddBookRequest;
import com.example.LMS.Dto.Request.IssueRequestDto;
import com.example.LMS.Dto.Response.IssueResponseDto;
import com.example.LMS.Exceptions.BadRequestException;
import com.example.LMS.Exceptions.ResourceNotFoundException;
import com.example.LMS.Models.Books;
import com.example.LMS.Models.IssuedBook;
import com.example.LMS.Repository.BooksRepository;
import com.example.LMS.Repository.IssuedBookRepository;
import com.example.LMS.Service.LibrarianService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/librarian")
// @PreAuthorize("hasAuthority('LIBRARIAN')") // ensure method security is enabled
public class LibrarianController {

    private final LibrarianService librarianService;
    private final BooksRepository booksRepository;
    private final IssuedBookRepository issuedBookRepository;

    public LibrarianController(LibrarianService librarianService,
                               BooksRepository booksRepository, IssuedBookRepository issuedBookRepository) {
        this.librarianService = librarianService;
        this.booksRepository = booksRepository;
        this.issuedBookRepository = issuedBookRepository;
    }


    // Create an issue request (could be called by users; librarian might also create requests)
    @PostMapping("/request-issue")
    public ResponseEntity<IssueResponseDto> requestIssue(@RequestBody IssueRequestDto dto) {

        IssueResponseDto created = librarianService.createIssueRequest(dto);
        return ResponseEntity.ok(created);
    }

    // Librarian: View all books
    @GetMapping("/all-books")
    public ResponseEntity<List<Books>> getAllBooksForLibrarian() {
        return ResponseEntity.ok(booksRepository.findAll());
    }

    //  librarian adds book
    @PostMapping("/add-book")
    public ResponseEntity<String> addBook(@RequestBody AddBookRequest dto) {
        String response = librarianService.addBook(dto);
        return ResponseEntity.ok(response);
    }

    // Librarian: list pending requests
    @GetMapping("/pending-requests")
    public ResponseEntity<List<IssueResponseDto>> pendingRequests() {
        return ResponseEntity.ok(librarianService.getPendingRequests());
    }

    // Librarian: approve a pending request
    @PostMapping("/approve/{id}")
    public ResponseEntity<IssueResponseDto> approve(@PathVariable Long id) {
        return ResponseEntity.ok(librarianService.approveRequest(id));
    }

    // Librarian: reject a pending request
    @PostMapping("/reject/{id}")
    public ResponseEntity<IssueResponseDto> reject(@PathVariable Long id) {
        return ResponseEntity.ok(librarianService.rejectRequest(id));
    }

    // Librarian: process a return (returns fine info)
//    @PostMapping("/return/{id}")
//    public ResponseEntity<IssueResponseDto> processReturn(@PathVariable Long id,
//                                                          @RequestParam(required = false) String returnDate) {
//        LocalDate rd = returnDate == null ? LocalDate.now() : LocalDate.parse(returnDate);
//        return ResponseEntity.ok(librarianService.processReturn(id, rd));
//    }

    @PostMapping("/return/{id}")
    public ResponseEntity<IssueResponseDto> processReturn(@PathVariable Long id) {
        return ResponseEntity.ok(
                librarianService.processReturn(id, LocalDate.now())
        );
    }


    // optional: list all issued records
    @GetMapping("/all-issued")
    public ResponseEntity<List<IssueResponseDto>> allIssued() {
        return ResponseEntity.ok(librarianService.getAllIssued());
    }

    // optional: list issued by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<IssueResponseDto>> issuedByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(librarianService.getUserIssued(userId));
    }


    @GetMapping("/renewal-requests")
    public ResponseEntity<List<IssueResponseDto>> renewalRequests() {
        return ResponseEntity.ok(librarianService.getRenewalRequests());
    }

    @PostMapping("/renewal/approve/{id}")
    public ResponseEntity<IssueResponseDto> approveRenewal(@PathVariable Long id) {
        return ResponseEntity.ok(librarianService.approveRenewal(id));
    }

    @PostMapping("/renewal/reject/{id}")
    public ResponseEntity<IssueResponseDto> rejectRenewal(@PathVariable Long id) {
        return ResponseEntity.ok(librarianService.rejectRenewal(id));
    }


}
