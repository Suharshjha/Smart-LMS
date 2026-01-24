import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageLibrarians from "./pages/admin/Books.tsx";
import Reports from "./pages/admin/Reports";
import LibrarianDashboard from "./pages/librarian/LibrarianDashboard";
import ManageBooks from "./pages/librarian/ManageBooks";
import IssueRequests from "./pages/librarian/IssueRequests";
import IssuedBooks from "./pages/librarian/IssuedBooks";
import UserDashboard from "./pages/user/UserDashboard";
import SearchBooks from "./pages/user/SearchBooks";
import MyBooks from "./pages/user/MyBooks";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import LibrarianAllBooks from "@/pages/librarian/LibrarianAllBooks.tsx";

const queryClient = new QueryClient();

// function AddBook() {
//   return null;
// }

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="librarians" element={<ManageLibrarians />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* User Routes */}
            <Route path="/user" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="search" element={<SearchBooks />} />
              <Route path="my-books" element={<MyBooks />} />
            </Route>


            <Route path="/librarian" element={
              <ProtectedRoute allowedRoles={['LIBRARIAN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<LibrarianDashboard />} />
              <Route path="books" element={<ManageBooks />} />          {/* Add Book Page */}
              <Route path="all-books" element={<LibrarianAllBooks />} /> {/* NEW PAGE */}
              <Route path="requests" element={<IssueRequests />} />
              <Route path="issued" element={<IssuedBooks />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

