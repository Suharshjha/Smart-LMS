// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { BookMarked, Calendar, AlertCircle } from "lucide-react";
// import { toast } from "sonner";
// import { apiFetch } from "@/lib/api";
//
// interface MyBook {
//   id: number;
//   bookName: string;
//   authorName: string;
//   issueDate: string;
//   dueDate: string;
//   status: string;
// }
//
// const MyBooks = () => {
//   const [books, setBooks] = useState<MyBook[]>([]);
//   const [loading, setLoading] = useState(true);
//
//   const loadMyBooks = async () => {
//     try {
//       const response = await apiFetch("/user/my-books");
//       setBooks(Array.isArray(response) ? response : []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load your books");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleRenew = async (id: number) => {
//     try {
//       await apiFetch(`/user/renew/${id}`, { method: "POST" });
//       toast.success("Renewal request sent!");
//       loadMyBooks();
//     } catch {
//       toast.error("Could not send renewal request");
//     }
//   };
//
//   const getDaysUntilDue = (dueDate: string) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due.getTime() - today.getTime();
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };
//
//   useEffect(() => {
//     loadMyBooks();
//   }, []);
//
//   if (loading) {
//     return (
//         <div className="p-8 text-center text-lg font-semibold">
//           Loading your books...
//         </div>
//     );
//   }
//
//   return (
//       <div className="p-8 space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">My Books</h1>
//           <p className="text-muted-foreground mt-1">
//             Books currently borrowed by you
//           </p>
//         </div>
//
//         <div className="grid grid-cols-1 gap-6">
//           {books.map((book) => {
//             const daysLeft = getDaysUntilDue(book.dueDate);
//             const isOverdueSoon = daysLeft <= 3;
//
//             return (
//                 <Card key={book.id} className="shadow-soft">
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div className="flex gap-4">
//                         <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
//                           <BookMarked className="h-6 w-6 text-primary" />
//                         </div>
//                         <div>
//                           <CardTitle>{book.bookName}</CardTitle>
//                           <p className="text-sm text-muted-foreground mt-1">
//                             {book.authorName}
//                           </p>
//                         </div>
//                       </div>
//
//                       <Badge variant={book.status === "ACTIVE" ? "default" : "secondary"}>
//                         {book.status}
//                       </Badge>
//                     </div>
//                   </CardHeader>
//
//                   <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="flex items-center gap-2 text-sm">
//                         <Calendar className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-muted-foreground">Issued: </span>
//                         <span className="font-medium">{book.issueDate}</span>
//                       </div>
//
//                       <div className="flex items-center gap-2 text-sm">
//                         <Calendar className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-muted-foreground">Due: </span>
//                         <span
//                             className={`font-medium ${
//                                 isOverdueSoon ? "text-destructive" : ""
//                             }`}
//                         >
//                       {book.dueDate}
//                     </span>
//                       </div>
//
//                       <div className="flex items-center gap-2 text-sm">
//                         {isOverdueSoon && (
//                             <AlertCircle className="h-4 w-4 text-destructive" />
//                         )}
//                         <span
//                             className={
//                               isOverdueSoon
//                                   ? "text-destructive font-medium"
//                                   : "text-muted-foreground"
//                             }
//                         >
//                       {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
//                     </span>
//                       </div>
//                     </div>
//
//                     <div className="mt-4">
//                       <Button variant="outline" onClick={() => handleRenew(book.id)}>
//                         Request Renewal
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//             );
//           })}
//
//           {books.length === 0 && (
//               <p className="text-center text-muted-foreground py-6">
//                 You have not borrowed any books yet.
//               </p>
//           )}
//         </div>
//       </div>
//   );
// };
//
// export default MyBooks;


import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookMarked, Calendar, AlertCircle, History } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface BookInfo {
  id: number;
  bookName: string;
  authorName: string;
  issueDate?: string | null;
  dueDate?: string | null;
  returnDate?: string | null;
  status: string;
}

const MyBooks = () => {
  const [current, setCurrent] = useState<BookInfo[]>([]);
  const [history, setHistory] = useState<BookInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [renewLoading, setRenewLoading] = useState<number | null>(null); // holds issueId being renewed

  // read userId from localStorage (must match how you store it)
  const stored = localStorage.getItem("lms_user");
  const userId = stored ? (JSON.parse(stored).userId as number) : null;

  const loadMyBooks = async () => {
    setLoading(true);
    try {
      // Endpoint should return { current: [...], history: [...] } as we discussed
      const response = await apiFetch(`/user/my-books?userId=${userId}`);
      setCurrent(Array.isArray(response.current) ? response.current : response.current ? [response.current] : []);
      setHistory(Array.isArray(response.history) ? response.history : []);
    } catch (err) {
      console.error("loadMyBooks error:", err);
      toast.error("Failed to load your books");
    } finally {
      setLoading(false);
    }
  };

  // Returns a Date object safe for string/null values
  const parseDate = (d?: string | null) => (d ? new Date(d) : null);

  // Add N days to an ISO date string and return ISO date string (yyyy-mm-dd)
  const addDaysToIso = (isoStr: string | undefined | null, days = 7) => {
    const d = parseDate(isoStr) ?? new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  // Renew request: call backend and update UI optimistically
  const handleRenew = async (issueId: number) => {
    if (!issueId) return toast.error("Invalid record");

    // prevent double clicks
    setRenewLoading(issueId);

    try {
      // Call backend: POST /user/renew/{id}
      await apiFetch(`/user/renew/${issueId}`, { method: "POST" });

      toast.success("Renewal request sent");

      // Optimistic update: extend the dueDate locally by 7 days (display immediate feedback)
      setCurrent((prev) =>
          prev.map((b) => {
            if (b.id === issueId) {
              const newDue = addDaysToIso(b.dueDate, 7);
              return { ...b, dueDate: newDue, status: "ACTIVE" };
            }
            return b;
          })
      );

      // also reload from server to stay consistent (best effort)
      await loadMyBooks();
    } catch (err) {
      console.error("Renewal error:", err);
      toast.error("Could not send renewal request");
    } finally {
      setRenewLoading(null);
    }
  };

  useEffect(() => {
    loadMyBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
        <div className="p-8 text-center text-lg font-semibold">
          Loading your books...
        </div>
    );
  }

  const getDaysUntilDue = (dueDate?: string | null) => {
    if (!dueDate) return Infinity;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
      <div className="p-8 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Books</h1>
          <p className="text-muted-foreground mt-1">Your borrowed books & reading history</p>
        </div>

        {/* CURRENT */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Currently Borrowed</h2>

          {current.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                You haven't borrowed any books yet.
              </p>
          )}

          <div className="grid grid-cols-1 gap-6">
            {current.map((book) => {
              const daysLeft = getDaysUntilDue(book.dueDate);
              const isOverdueSoon = daysLeft <= 3;

              // disable renew if already returned or if status not ACTIVE/APPROVED
              const canRenew =
                  !book.returnDate &&
                  ["ACTIVE", "APPROVED", "ISSUED"].includes(book.status?.toUpperCase());

              return (
                  <Card key={book.id} className="shadow-soft">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookMarked className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{book.bookName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{book.authorName}</p>
                          </div>
                        </div>
                        <Badge>{book.status ?? "ACTIVE"}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Issued: <span className="font-medium">{book.issueDate ?? "—"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Due:{" "}
                          <span className={`font-medium ${isOverdueSoon ? "text-destructive" : ""}`}>
                        {book.dueDate ?? "—"}
                      </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          {isOverdueSoon && <AlertCircle className="h-4 w-4 text-destructive" />}
                          <span className={isOverdueSoon ? "text-destructive" : "text-muted-foreground"}>
                        {daysLeft === Infinity ? "No due date" : daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                      </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleRenew(book.id)}
                            disabled={!canRenew || renewLoading === book.id}
                        >
                          {renewLoading === book.id ? "Renewing..." : "Request Renewal"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              );
            })}
          </div>
        </div>

        {/* HISTORY */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <History className="h-5 w-5" /> Reading History
          </h2>

          {history.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No books returned yet.</p>
          )}

          <div className="space-y-4">
            {history.map((h) => (
                <Card key={h.id} className="shadow-soft">
                  <CardContent className="p-4">
                    <p className="font-medium">{h.bookName}</p>
                    <p className="text-sm text-muted-foreground">{h.authorName}</p>
                    <p className="text-sm">Returned on: <span className="font-medium">{h.returnDate ?? "—"}</span></p>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </div>
  );
};

export default MyBooks;
