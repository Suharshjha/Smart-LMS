package com.example.LMS.Dto.Request;

import java.time.LocalDate;

public class IssueRequestDto {
    private Long bookId;
    private Long userId;
    private LocalDate dueDate; // optional: if not provided service may set default

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
