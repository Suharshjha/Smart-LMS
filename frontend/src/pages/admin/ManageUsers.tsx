// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Search, UserPlus, Ban, CheckCircle } from 'lucide-react';
// import { useState } from 'react';
//
// const ManageUsers = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//
//   const users = [
//     { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', booksIssued: 3, status: 'active' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', booksIssued: 2, status: 'active' },
//     { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', booksIssued: 1, status: 'active' },
//     { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '+1234567893', booksIssued: 0, status: 'inactive' },
//     { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1234567894', booksIssued: 4, status: 'active' },
//   ];
//
//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//
//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
//           <p className="text-muted-foreground mt-1">View and manage library members</p>
//         </div>
//         <Button className="gap-2">
//           <UserPlus className="h-4 w-4" />
//           Add New User
//         </Button>
//       </div>
//
//       <Card className="shadow-soft">
//         <CardHeader>
//           <CardTitle>All Users</CardTitle>
//           <div className="relative mt-4">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by name or email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Phone</TableHead>
//                 <TableHead>Books Issued</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredUsers.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell className="font-medium">{user.name}</TableCell>
//                   <TableCell className="text-muted-foreground">{user.email}</TableCell>
//                   <TableCell className="text-muted-foreground">{user.phone}</TableCell>
//                   <TableCell>{user.booksIssued}</TableCell>
//                   <TableCell>
//                     <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
//                       {user.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       {user.status === 'active' ? (
//                         <Button variant="ghost" size="sm" className="gap-1">
//                           <Ban className="h-4 w-4" />
//                           Suspend
//                         </Button>
//                       ) : (
//                         <Button variant="ghost" size="sm" className="gap-1">
//                           <CheckCircle className="h-4 w-4" />
//                           Activate
//                         </Button>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
//
// export default ManageUsers;


import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Form Fields
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("USER");

  // Load users from backend
  const loadUsers = async () => {
    try {
      const data = await apiFetch(
          "/admin/all-users",
          { method: "GET" }
      );
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Add User Handler
  const handleAddUser = async () => {
    if (!newUsername || !newEmail || !newPassword) {
      toast.error("All fields are required!");
      return;
    }

    const payload = {
      username: newUsername,
      email: newEmail,
      password: newPassword,
      role: newRole,
    };

    try {
      await apiFetch(
          "/admin/add-user",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
      );

      toast.success("User added successfully!");
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("USER");
      // console.log("User addes");
      loadUsers(); // Reload table
    } catch (err) {
      toast.error("Adding user failed");
      console.error(err);
    }
  };

  // Searching users
  const filteredUsers = users.filter(
      (u) =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="p-8 space-y-6">
        {/* Add User Form */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <Input placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

            <select
                className="border rounded p-2 w-full"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="USER">User</option>
              <option value="LIBRARIAN">Librarian</option>
              <option value="ADMIN">Admin</option>
            </select>

            <Button className="w-full gap-2" onClick={handleAddUser}>
              <UserPlus className="h-4 w-4" /> Add User
            </Button>
          </CardContent>
        </Card>

        {/* User List */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search by username or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((u) => (
                    <TableRow key={u.userId}>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge>{u.role}</Badge>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
};

export default ManageUsers;
