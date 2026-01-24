import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

type AdminBook = {
  id: number;
  bookName: string;
  authorName: string;
  category: string;
  numberOfCopies: number;
};

const ManageBooksAdmin: React.FC = () => {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch books
  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/all-books");
      setBooks(data || []);
    } catch (err: any) {
      console.error("Load books error:", err);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return books;

    return books.filter((b) =>
        [
          b.bookName,
          b.authorName,
          b.category,
          String(b.id),
        ]
            .join(" ")
            .toLowerCase()
            .includes(q)
    );
  }, [books, search]);

  return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Books</h1>
            <p className="text-muted-foreground mt-1">View all books (Admin only).</p>
          </div>

          <Button onClick={handleRefresh} variant="ghost" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col md:flex-row md:justify-between gap-4">
            <CardTitle>All Books</CardTitle>

            <div className="flex items-center gap-3">
              <Input
                  placeholder="Search title, author, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="ghost" onClick={() => setSearch("")}>
                Clear
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
                <div className="p-6 text-center text-muted-foreground">Loading books...</div>
            ) : filtered.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">No books found</div>
            ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Copies</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filtered.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-medium">{b.bookName}</TableCell>
                            <TableCell>{b.authorName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{b.category}</Badge>
                            </TableCell>
                            <TableCell>{b.numberOfCopies}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default ManageBooksAdmin;
