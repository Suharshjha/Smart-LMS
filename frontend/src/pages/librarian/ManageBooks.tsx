// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
// import { useState } from 'react';
//
// const ManageBooks = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//
//   const books = [
//     { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', totalCopies: 5, availableCopies: 3 },
//     { id: 2, title: '1984', author: 'George Orwell', isbn: '9780451524935', totalCopies: 8, availableCopies: 5 },
//     { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', totalCopies: 6, availableCopies: 4 },
//     { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', totalCopies: 4, availableCopies: 2 },
//     { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769174', totalCopies: 7, availableCopies: 7 },
//   ];
//
//   const filteredBooks = books.filter(book =>
//     book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     book.isbn.includes(searchTerm)
//   );
//
//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Manage Books</h1>
//           <p className="text-muted-foreground mt-1">Add, edit, and manage library books</p>
//         </div>
//         <Button className="gap-2">
//           <Plus className="h-4 w-4" />
//           Add New Book
//         </Button>
//       </div>
//
//       <Card className="shadow-soft">
//         <CardHeader>
//           <CardTitle>Book Inventory</CardTitle>
//           <div className="relative mt-4">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by title, author, or ISBN..."
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
//                 <TableHead>Title</TableHead>
//                 <TableHead>Author</TableHead>
//                 <TableHead>ISBN</TableHead>
//                 <TableHead>Total Copies</TableHead>
//                 <TableHead>Available</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredBooks.map((book) => (
//                 <TableRow key={book.id}>
//                   <TableCell className="font-medium">{book.title}</TableCell>
//                   <TableCell>{book.author}</TableCell>
//                   <TableCell className="text-muted-foreground">{book.isbn}</TableCell>
//                   <TableCell>{book.totalCopies}</TableCell>
//                   <TableCell>
//                     <span className={book.availableCopies > 0 ? 'text-accent font-medium' : 'text-destructive font-medium'}>
//                       {book.availableCopies}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <Button variant="ghost" size="sm">
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Trash2 className="h-4 w-4 text-destructive" />
//                       </Button>
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
// export default ManageBooks;
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const ManageBooks = () => {
  const { user } = useAuth();

  const [bookId, setBookId] = useState("");
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [numberOfCopies, setNumberOfCopies] = useState(1);
  const [bookCategory, setBookCategory] = useState("");

  const handleAddBook = async () => {
    if (!user?.token) {
      toast.error("You are not authenticated. Please login again.");
      return;
    }

    if (!bookName || !authorName || !bookCategory) {
      toast.error("All fields are required!");
      return;
    }

    const payload = {
      bookId: bookId.trim() !== "" ? bookId : `BOOK-${Date.now()}`,
      bookName,
      authorName,
      numberOfCopies,
      bookCategory,
    };

    try {
      const response = await fetch("http://localhost:8080/librarian/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to add book");
      }

      toast.success("Book added successfully!");

      setBookId("");
      setBookName("");
      setAuthorName("");
      setNumberOfCopies(1);
      setBookCategory("");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
      <div className="p-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
                placeholder="Book ID (optional)"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
            />
            <Input
                placeholder="Book Name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
            />
            <Input
                placeholder="Author Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
            />
            <Input
                type="number"
                min={1}
                placeholder="Number of Copies"
                value={numberOfCopies}
                onChange={(e) => setNumberOfCopies(Number(e.target.value))}
            />
            <Input
                placeholder="Category"
                value={bookCategory}
                onChange={(e) => setBookCategory(e.target.value)}
            />

            <Button className="w-full" onClick={handleAddBook}>
              Add Book
            </Button>
          </CardContent>
        </Card>
      </div>
  );
};

export default ManageBooks;
