package com.example.LMS.Dto.Response;

import java.math.BigDecimal;

public class IssueResponseDto {

    private Long id;
    private String bookName;
    private String authorName;
    private Long userId;
    private String issueDate;
    private String dueDate;
    private String returnDate;
    private String status;
    private String fine;

    // NEW FIELDS
    private String userName;
    private String userEmail;
    private String requestDate;

    public IssueResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookName() { return bookName; }
    public void setBookName(String bookName) { this.bookName = bookName; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFine() { return fine; }
    public void setFine(BigDecimal fine) {
        this.fine = (fine != null) ? fine.toString() : "0";
    }

    // -----------------------------
    // NEW GETTERS & SETTERS
    // -----------------------------

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getRequestDate() { return requestDate; }
    public void setRequestDate(String requestDate) { this.requestDate = requestDate; }
}
