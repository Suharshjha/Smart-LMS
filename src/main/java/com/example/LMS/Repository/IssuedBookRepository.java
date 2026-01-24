package com.example.LMS.Repository;

import com.example.LMS.Models.IssuedBook;
import com.example.LMS.Models.User;
import com.example.LMS.Models.Books;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssuedBookRepository extends JpaRepository<IssuedBook, Long> {
    List<IssuedBook> findByStatus(IssuedBook.Status status);
    List<IssuedBook> findByUser(User user);
    List<IssuedBook> findByBook(Books book);
    long countByStatus(IssuedBook.Status status);

}
