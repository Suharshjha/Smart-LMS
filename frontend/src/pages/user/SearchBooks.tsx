// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Search, BookOpen } from 'lucide-react';
// import { useState } from 'react';
// import { toast } from 'sonner';
//
// const SearchBooks = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//
//   const books = [
//     { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', availableCopies: 3, totalCopies: 5 },
//     { id: 2, title: '1984', author: 'George Orwell', genre: 'Dystopian', availableCopies: 5, totalCopies: 8 },
//     { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', availableCopies: 4, totalCopies: 6 },
//     { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', availableCopies: 2, totalCopies: 4 },
//     { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Classic', availableCopies: 7, totalCopies: 7 },
//     { id: 6, title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', genre: 'Fantasy', availableCopies: 0, totalCopies: 10 },
//   ];
//
//   const filteredBooks = books.filter(book =>
//     book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     book.genre.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//
//   const handleRequest = (bookTitle: string) => {
//     toast.success(`Request sent for: ${bookTitle}`);
//   };
//
//   return (
//     <div className="p-8 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Search Books</h1>
//         <p className="text-muted-foreground mt-1">Browse and request books from the library</p>
//       </div>
//
//       <Card className="shadow-soft">
//         <CardHeader>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by title, author, or genre..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </CardHeader>
//       </Card>
//
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredBooks.map((book) => (
//           <Card key={book.id} className="shadow-soft hover:shadow-medium transition-smooth">
//             <CardHeader>
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex-1">
//                   <CardTitle className="text-lg">{book.title}</CardTitle>
//                   <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
//                 </div>
//                 <BookOpen className="h-8 w-8 text-primary shrink-0" />
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Genre:</span>
//                 <Badge variant="secondary">{book.genre}</Badge>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Available:</span>
//                 <span className={`font-medium ${book.availableCopies > 0 ? 'text-accent' : 'text-destructive'}`}>
//                   {book.availableCopies} / {book.totalCopies}
//                 </span>
//               </div>
//               <Button
//                 className="w-full"
//                 disabled={book.availableCopies === 0}
//                 onClick={() => handleRequest(book.title)}
//               >
//                 {book.availableCopies > 0 ? 'Request Book' : 'Not Available'}
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };
//
// export default SearchBooks;


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const SearchBooks = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    try {
      const data = await apiFetch(`/user/search?keyword=${encodeURIComponent(keyword)}`, {});
      setResults(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
      <div className="p-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Search Books</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
                placeholder="Search by name, author or category..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </CardContent>
        </Card>

        {/* Render results */}
        {results.map((b) => (
            <div key={b.bookId}>{b.bookName} – {b.authorName}</div>
        ))}
      </div>
  );
};

export default SearchBooks;
