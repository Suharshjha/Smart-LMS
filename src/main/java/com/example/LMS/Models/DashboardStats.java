package com.example.LMS.Models;

public class DashboardStats {
    private long totalUsers;
    private long totalBooks;
    private long issuedBooks;
    private long overdueBooks;

    public DashboardStats(long totalUsers, long totalBooks, long issuedBooks, long overdueBooks) {
        this.totalUsers = totalUsers;
        this.totalBooks = totalBooks;
        this.issuedBooks = issuedBooks;
        this.overdueBooks = overdueBooks;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalBooks() { return totalBooks; }
    public long getIssuedBooks() { return issuedBooks; }
    public long getOverdueBooks() { return overdueBooks; }
}
