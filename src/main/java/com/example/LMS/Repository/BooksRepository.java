package com.example.LMS.Repository;

import com.example.LMS.Models.Books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BooksRepository extends JpaRepository<Books, Long> {

    @Query("SELECT b FROM Books b " +
            "WHERE LOWER(b.bookName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(b.authorName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(b.bookCategory) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Books> searchBooks(@Param("keyword") String keyword);

    List<Books> findByIssued(boolean issued);

    // 2️⃣ Overdue books
    @Query("SELECT b FROM Books b WHERE b.dueDate < CURRENT_DATE AND b.issued = true")
    List<Books> findOverdueBooks();

    // 3️⃣ Popular books (sorted by issueCount)
    @Query("SELECT b FROM Books b ORDER BY b.issueCount DESC")
    List<Books> findPopularBooks();

    // existing methods...

    long countByIssuedTrue();

    // count overdue: dueDate before today AND issued = true
    long countByDueDateBeforeAndIssuedTrue(LocalDate date);
}
