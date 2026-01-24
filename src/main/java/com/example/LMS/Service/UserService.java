package com.example.LMS.Service;

import com.example.LMS.Dto.Request.IssueRequestDto;
import com.example.LMS.Dto.Response.IssueResponseDto;
import com.example.LMS.Exceptions.BadRequestException;
import com.example.LMS.Exceptions.ResourceNotFoundException;
import com.example.LMS.Models.Books;
import com.example.LMS.Models.IssuedBook;
import com.example.LMS.Models.User;
import com.example.LMS.Repository.BooksRepository;
import com.example.LMS.Repository.IssuedBookRepository;
import com.example.LMS.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final BooksRepository booksRepository;
    private final IssuedBookRepository issuedBookRepository;
    private final LibrarianService librarianService;
    private final UserRepository userRepository;

    public UserService(BooksRepository booksRepository,
                       IssuedBookRepository issuedBookRepository,
                       LibrarianService librarianService,
                       UserRepository userRepository) {

        this.booksRepository = booksRepository;
        this.issuedBookRepository = issuedBookRepository;
        this.librarianService = librarianService;
        this.userRepository = userRepository;
    }

    // 1️⃣ SEARCH BOOKS
    public List<Books> searchBooks(String keyword) {
        return booksRepository.searchBooks(keyword);
    }

    // 2️⃣ USER REQUESTS A BOOK
    public IssueResponseDto requestBook(IssueRequestDto dto) {
        return librarianService.createIssueRequest(dto);
    }

    // 3️⃣ ALL ISSUED BOOKS FOR THE USER (current + returned)
    public List<IssueResponseDto> getIssuedBooks(Long userId) {
        return librarianService.getUserIssued(userId);
    }

    // 4️⃣ ALL BOOKS FOR USER DASHBOARD
    public List<Books> getAllBooks() {
        return booksRepository.findAll();
    }

    // ----------------------------------------------------------
    // 5️⃣ CONVERT ENTITY → DTO (same as librarianService format)
    // ----------------------------------------------------------
    private IssueResponseDto toDto(IssuedBook ib) {

        IssueResponseDto dto = new IssueResponseDto();
        dto.setId(ib.getId());
        dto.setBookName(ib.getBook().getBookName());
        dto.setAuthorName(ib.getBook().getAuthorName());
        dto.setUserId(ib.getUser().getUserId());

        dto.setIssueDate(
                ib.getIssueDate() != null ? ib.getIssueDate().toString() : null
        );
        dto.setDueDate(
                ib.getDueDate() != null ? ib.getDueDate().toString() : null
        );
        dto.setReturnDate(
                ib.getReturnDate() != null ? ib.getReturnDate().toString() : null
        );

        dto.setStatus(ib.getStatus().name());
        dto.setFine(ib.getFine());

        return dto;
    }

    // 6️⃣ HISTORY (ONLY RETURNED)
    public List<IssueResponseDto> getHistory(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return issuedBookRepository.findByUser(user).stream()
                .filter(i -> i.getStatus() == IssuedBook.Status.RETURNED)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------
    // 7️⃣ USER → REQUEST RENEWAL
    // ----------------------------------------------------------
    public IssueResponseDto requestRenewal(Long issueId) {

        IssuedBook ib = issuedBookRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issued record not found"));

        // Allow renewal only when APPROVED or previously rejected
        if (ib.getStatus() != IssuedBook.Status.APPROVED &&
                ib.getStatus() != IssuedBook.Status.RENEWAL_REJECTED) {
            throw new BadRequestException("You can only request renewal for approved books");
        }

        ib.setStatus(IssuedBook.Status.RENEWAL_PENDING);
        issuedBookRepository.save(ib);

        return librarianService.toDto(ib);
    }
}
