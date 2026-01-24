import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  Users,
  FileText,
  BookMarked,
  UserCheck,
  LogOut,
  LayoutDashboard,
  Search,
  BookCopy, Book
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Books from "@/pages/admin/Books.tsx";

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin/users', icon: Users, label: 'Manage Users' },
          { to: '/admin/librarians', icon: BookOpen, label: 'Books' },
          { to: '/admin/reports', icon: FileText, label: 'Reports' },
        ];
      case 'LIBRARIAN':
        return [
          { to: '/librarian/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/librarian/books', icon: BookOpen, label: 'Manage Books' },
          { to: '/librarian/all-books', icon: Book, label: 'All Books' },
          { to: '/librarian/requests', icon: BookMarked, label: 'Issue Requests' },
          { to: '/librarian/issued', icon: BookCopy, label: 'Issued Books' },
        ];
      case 'USER':
        return [
          { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/user/search', icon: Search, label: 'Search Books' },
          { to: '/user/my-books', icon: BookMarked, label: 'My Books' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-sidebar-primary" />
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">LibraryMS</h1>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
