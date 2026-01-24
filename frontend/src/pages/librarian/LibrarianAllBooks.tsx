import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

interface Book {
    bookId: number;
    bookName: string;
    authorName: string;
    numberOfCopies: number;
    bookCategory: string;
}

const LibrarianAllBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState("");

    const loadBooks = async () => {
        try {
            const data = await apiFetch("/librarian/all-books"); // ✔ correct endpoint
            setBooks(data); // ✔ fixed
        } catch (error) {
            console.error("Failed to load books:", error);
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const filtered = books.filter((b) =>
        b.bookName.toLowerCase().includes(search.toLowerCase()) ||
        b.authorName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">All Books</h1>
                <p className="text-muted-foreground mt-1">List of all books in the library</p>
            </div>

            <Card className="shadow-soft">
                <CardHeader>
                    <CardTitle>Books Inventory</CardTitle>

                    <Input
                        placeholder="Search by book name or author..."
                        className="mt-3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Book Name</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Copies</TableHead>
                                <TableHead>Category</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filtered.map((book) => (
                                <TableRow key={book.bookId}>
                                    <TableCell>{book.bookId}</TableCell>
                                    <TableCell className="font-medium">{book.bookName}</TableCell>
                                    <TableCell>{book.authorName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{book.numberOfCopies}</Badge>
                                    </TableCell>
                                    <TableCell>{book.bookCategory}</TableCell>
                                </TableRow>
                            ))}

                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No books found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default LibrarianAllBooks;
