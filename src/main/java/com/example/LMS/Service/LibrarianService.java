package com.example.LMS.Service;

import com.example.LMS.Dto.Request.AddBookRequest;
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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibrarianService {

    private final IssuedBookRepository issuedBookRepository;
    private final UserRepository userRepository;
    private final BooksRepository booksRepository;

    private static final BigDecimal FINE_PER_DAY = BigDecimal.valueOf(10);

    public LibrarianService(IssuedBookRepository issuedBookRepository,
                            UserRepository userRepository,
                            BooksRepository booksRepository) {
        this.issuedBookRepository = issuedBookRepository;
        this.userRepository = userRepository;
        this.booksRepository = booksRepository;
    }

    // -----------------------------
    // ADD BOOK
    // -----------------------------
    public String addBook(AddBookRequest dto) {
        Books book = new Books();
        book.setBookName(dto.getBookName());
        book.setAuthorName(dto.getAuthorName());
        book.setBookCategory(dto.getBookCategory());
        book.setNumberOfCopies(dto.getNumberOfCopies());
        book.setPopularityScore(0);

        booksRepository.save(book);
        return "Book added successfully!";
    }

    // -----------------------------
    // CREATE ISSUE REQUEST (User)
    // -----------------------------
    public IssueResponseDto createIssueRequest(IssueRequestDto dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Books book = booksRepository.findById(dto.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        IssuedBook request = new IssuedBook();
        request.setUser(user);
        request.setBook(book);

        LocalDate today = LocalDate.now();
        request.setIssueDate(today);

        LocalDate due = dto.getDueDate() != null ? dto.getDueDate() : today.plusDays(14);
        request.setDueDate(due);

        request.setStatus(IssuedBook.Status.PENDING);
        request.setFine(BigDecimal.ZERO);

        IssuedBook saved = issuedBookRepository.save(request);
        return toDto(saved);
    }


    // -----------------------------
    // GET PENDING REQUESTS (ISSUE + RENEWAL)
    // -----------------------------
    public List<IssueResponseDto> getPendingRequests() {
        return issuedBookRepository.findAll().stream()
                .filter(ib ->
                        ib.getStatus() == IssuedBook.Status.PENDING ||
                                ib.getStatus() == IssuedBook.Status.RENEWAL_PENDING
                )
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    // -----------------------------
    // GET ISSUED FOR USER
    // -----------------------------
//    public List<IssueResponseDto> getUserIssued(Long userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        return issuedBookRepository.findByUser(user)
//                .stream().map(this::toDto).collect(Collectors.toList());
//    }

    public List<IssueResponseDto> getUserIssued(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return issuedBookRepository.findByUser(user)
                .stream()
                .filter(ib ->
                        ib.getStatus() == IssuedBook.Status.APPROVED ||
                                ib.getStatus() == IssuedBook.Status.RENEWAL_APPROVED
                )
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    // -----------------------------
    // APPROVE ISSUE REQUEST
    // -----------------------------
    @Transactional
    public IssueResponseDto approveRequest(Long issueId) {

        IssuedBook ib = issuedBookRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (ib.getStatus() != IssuedBook.Status.PENDING)
            throw new BadRequestException("Only issue requests can be approved");

        Books book = ib.getBook();

        if (book.getNumberOfCopies() <= 0)
            throw new BadRequestException("No copies available");

        book.setNumberOfCopies(book.getNumberOfCopies() - 1);
        booksRepository.save(book);

        ib.setStatus(IssuedBook.Status.APPROVED);

        return toDto(issuedBookRepository.save(ib));
    }

    // -----------------------------
    // REJECT ISSUE REQUEST
    // -----------------------------
    @Transactional
    public IssueResponseDto rejectRequest(Long issueId) {

        IssuedBook ib = issuedBookRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (ib.getStatus() != IssuedBook.Status.PENDING)
            throw new BadRequestException("Only issue requests can be rejected");

        ib.setStatus(IssuedBook.Status.REJECTED);
        return toDto(issuedBookRepository.save(ib));
    }


    // -----------------------------
    // PROCESS RETURN
    // -----------------------------
//    @Transactional
//    public IssueResponseDto processReturn(Long issueId, LocalDate returnDate) {
//
//        IssuedBook ib = issuedBookRepository.findById(issueId)
//                .orElseThrow(() -> new ResourceNotFoundException("Issued record not found"));
//
//        if (ib.getStatus() != IssuedBook.Status.APPROVED &&
//                ib.getStatus() != IssuedBook.Status.RENEWAL_APPROVED)
//            throw new BadRequestException("Only borrowed books can be returned");
//
//        ib.setReturnDate(returnDate != null ? returnDate : LocalDate.now());
//
//        BigDecimal fine = calculateFine(ib.getDueDate(), ib.getReturnDate());
//        ib.setFine(fine);
//
//        ib.setStatus(IssuedBook.Status.RETURNED);
//
//        Books book = ib.getBook();
//        book.setNumberOfCopies(book.getNumberOfCopies() + 1);
//        booksRepository.save(book);
//
//        return toDto(issuedBookRepository.save(ib));
//    }
//
//    private BigDecimal calculateFine(LocalDate due, LocalDate returned) {
//        if (returned.isBefore(due) || returned.isEqual(due))
//            return BigDecimal.ZERO;
//
//        long daysOverdue = ChronoUnit.DAYS.between(due, returned);
//        return FINE_PER_DAY.multiply(BigDecimal.valueOf(daysOverdue));
//    }

    @Transactional
    public IssueResponseDto processReturn(Long issueId, LocalDate returnDate) {

        IssuedBook ib = issuedBookRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issued record not found"));

        // Allow return for APPROVED and RENEWAL_APPROVED books
        if (ib.getStatus() != IssuedBook.Status.APPROVED &&
                ib.getStatus() != IssuedBook.Status.RENEWAL_APPROVED) {
            throw new BadRequestException("Only borrowed books can be returned");
        }

        // Set return date (default to today)
        LocalDate actualReturnDate = (returnDate != null) ? returnDate : LocalDate.now();
        ib.setReturnDate(actualReturnDate);

        // Calculate fine (if overdue)
        BigDecimal fine = calculateFine(ib.getDueDate(), actualReturnDate);
        ib.setFine(fine);

        // Update status to RETURNED
        ib.setStatus(IssuedBook.Status.RETURNED);

        // Increase book copies back
        Books book = ib.getBook();
        book.setNumberOfCopies(book.getNumberOfCopies() + 1);
        booksRepository.save(book);

        // Save and return DTO
        IssuedBook saved = issuedBookRepository.save(ib);
        return toDto(saved);
    }

    private BigDecimal calculateFine(LocalDate due, LocalDate returned) {
        if (returned.isBefore(due) || returned.isEqual(due)) {
            return BigDecimal.ZERO;
        }

        long daysOverdue = ChronoUnit.DAYS.between(due, returned);
        return FINE_PER_DAY.multiply(BigDecimal.valueOf(daysOverdue));
    }

    // -----------------------------
    // FINAL DTO BUILDER
    // -----------------------------
    public IssueResponseDto toDto(IssuedBook ib) {
        IssueResponseDto dto = new IssueResponseDto();

        dto.setId(ib.getId());
        dto.setBookName(ib.getBook().getBookName());
        dto.setAuthorName(ib.getBook().getAuthorName());

        dto.setUserId(ib.getUser().getUserId());
        dto.setUserName(ib.getUser().getUsername());
        // adjust name getter
        dto.setUserEmail(ib.getUser().getEmail());     // adjust email getter

        dto.setIssueDate(ib.getIssueDate() != null ? ib.getIssueDate().toString() : null);
        dto.setDueDate(ib.getDueDate() != null ? ib.getDueDate().toString() : null);
        dto.setReturnDate(ib.getReturnDate() != null ? ib.getReturnDate().toString() : null);

        dto.setRequestDate(
                ib.getIssueDate() != null ? ib.getIssueDate().toString() : null
        );

        dto.setStatus(ib.getStatus().name());
        dto.setFine(ib.getFine());

        return dto;
    }

    // -----------------------------
    // RENEWAL APPROVE
    // -----------------------------
    @Transactional
    public IssueResponseDto approveRenewal(Long issueId) {

        IssuedBook ib = issuedBookRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));

        if (ib.getStatus() != IssuedBook.Status.RENEWAL_PENDING)
            throw new BadRequestException("No renewal request exists");

        ib.setDueDate(ib.getDueDate().plusDays(7));
        ib.setStatus(IssuedBook.Status.RENEWAL_APPROVED);

        return toDto(issuedBookRepository.save(ib));
    }

    // -----------------------------
    // RENEWAL REJECT
    // -----------------------------
    @Transactional
    public IssueResponseDto rejectRenewal(Long issueId) {

        IssuedBook ib = issuedBookRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found"));

        if (ib.getStatus() != IssuedBook.Status.RENEWAL_PENDING)
            throw new BadRequestException("No renewal request exists");

        ib.setStatus(IssuedBook.Status.RENEWAL_REJECTED);

        return toDto(issuedBookRepository.save(ib));
    }

//    @Transactional
//    public List<IssueResponseDto> getAllIssued() {
//        return issuedBookRepository.findAll()
//                .stream()
//                .map(this::toDto)
//                .collect(Collectors.toList());
//    }

    public List<IssueResponseDto> getAllIssued() {
        return issuedBookRepository.findAll().stream()
                .filter(ib ->
                        ib.getStatus() == IssuedBook.Status.APPROVED ||
                                ib.getStatus() == IssuedBook.Status.RENEWAL_APPROVED
                )
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    public List<IssueResponseDto> getRenewalRequests() {
        return issuedBookRepository.findByStatus(IssuedBook.Status.RENEWAL_PENDING)
                .stream().map(this::toDto).collect(Collectors.toList());
    }
}
