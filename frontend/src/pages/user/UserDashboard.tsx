// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BookMarked, Search, Clock, CheckCircle } from "lucide-react";
// import { apiFetch } from "@/lib/api";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
//
// interface Book {
//   bookId: number;
//   bookName: string;
//   authorName: string;
// }
//
// interface MyBook {
//   id: number;
//   bookName: string;
//   authorName: string;
//   dueDate: string;
//   issueDate: string;
//   status: string;
// }
//
// const UserDashboard = () => {
//   const navigate = useNavigate();
//
//   const [borrowed, setBorrowed] = useState<MyBook[]>([]);
//   const [history, setHistory] = useState<any[]>([]);
//   const [totalBooks, setTotalBooks] = useState(0);
//   const [pendingRequests, setPendingRequests] = useState(0);
//   const [allBooks, setAllBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);
//
//   // Request modal state
//   const [open, setOpen] = useState(false);
//   const [searchBook, setSearchBook] = useState("");
//   const [selectedBook, setSelectedBook] = useState<Book | null>(null);
//
//   const userData = JSON.parse(localStorage.getItem("lms_user") || "null");
//   // const userId = userData?.user?.id;
//   const userId = userData?.userId;
//
//
//   // Load dashboard
//   const loadDashboard = async () => {
//     try {
//       const myBooks = await apiFetch(`/user/issued/${userId}`);
//       const allBooksApi = await apiFetch("/admin/all-books");
//       const requests = await apiFetch("/librarian/pending-requests");
//
//       let hist: any[] = [];
//       try {
//         hist = await apiFetch(`/user/history/${userId}`);
//       } catch {
//         hist = [];
//       }
//
//       // setBorrowed(myBooks);
//
//       setBorrowed(myBooks.filter((b: any) => b.status === "APPROVED"));
//       setAllBooks(allBooksApi);
//       setPendingRequests(requests.length);
//       setTotalBooks(allBooksApi.length);
//       setHistory(hist);
//
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // LIVE SEARCH books from backend
//   const searchBooksLive = async (keyword: string) => {
//     setSearchBook(keyword);
//
//     if (keyword.trim() === "") {
//       setAllBooks([]);
//       return;
//     }
//
//     try {
//       const res = await apiFetch(`/user/search?keyword=${keyword}`);
//       setAllBooks(res);
//     } catch {
//       setAllBooks([]);
//     }
//   };
//
//   // Send book request
//   const requestIssue = async () => {
//     if (!selectedBook) return toast.error("Select a book first");
//
//     try {
//       await apiFetch("/user/request-book", {
//         method: "POST",
//         body: JSON.stringify({
//           userId,
//           bookId: selectedBook.bookId,
//         }),
//       });
//
//       toast.success(`Issue request sent for: ${selectedBook.bookName}`);
//       setOpen(false);
//       setSelectedBook(null);
//       setSearchBook("");
//       setAllBooks([]);
//
//       loadDashboard();
//     } catch {
//       toast.error("Failed to send request");
//     }
//   };
//
//   useEffect(() => {
//     loadDashboard();
//   }, []);
//
//   if (loading) {
//     return <div className="p-8 text-center text-lg font-semibold">Loading your dashboard...</div>;
//   }
//
//   const stats = [
//     { title: "Books Borrowed", value: borrowed.length, icon: BookMarked, color: "text-primary" },
//     { title: "Pending Requests", value: pendingRequests, icon: Clock, color: "text-destructive" },
//     { title: "Books Returned", value: history.length, icon: CheckCircle, color: "text-accent" },
//     { title: "Available Books", value: totalBooks, icon: Search, color: "text-secondary" },
//   ];
//
//   const filteredBooks = allBooks;
//
//   return (
//       <div className="p-8 space-y-8">
//
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
//           <p className="text-muted-foreground mt-1">
//             Welcome back! Track your books & requests.
//           </p>
//         </div>
//
//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat) => (
//               <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-smooth">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-muted-foreground">
//                     {stat.title}
//                   </CardTitle>
//                   <stat.icon className={`h-5 w-5 ${stat.color}`} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{stat.value}</div>
//                 </CardContent>
//               </Card>
//           ))}
//         </div>
//
//         {/* My Borrowed Books */}
//         <Card className="shadow-soft">
//           <CardHeader>
//             <CardTitle>Currently Borrowed Books</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {borrowed.length === 0 && (
//                   <p className="text-muted-foreground text-center py-4">
//                     You haven't borrowed any books yet.
//                   </p>
//               )}
//
//               {borrowed.map((book) => (
//                   <div
//                       key={book.id}
//                       className="flex items-center justify-between p-4 bg-muted rounded-lg"
//                   >
//                     <div className="flex-1">
//                       <p className="font-medium">{book.bookName}</p>
//                       <p className="text-sm text-muted-foreground">{book.authorName}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-medium">Due: {book.dueDate}</p>
//                       {/*<Badge>{book.status}</Badge>*/}
//                       <Badge variant="default">
//                         {book.status === "APPROVED" ? "Borrowed" : book.status}
//                       </Badge>
//
//                     </div>
//                   </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//
//         {/* Quick Actions + History */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//
//           {/* Quick Actions */}
//           <Card className="shadow-soft">
//             <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <Button className="w-full p-3 text-left" onClick={() => setOpen(true)}>
//                   Request a Book
//                 </Button>
//
//                 <Button className="w-full p-3 text-left bg-secondary" onClick={() => navigate("/user/my-books")}>
//                   View My Books
//                 </Button>
//
//                 <Button className="w-full p-3 text-left bg-accent text-accent-foreground"
//                         onClick={() => navigate("/user/my-books")}>
//                   Renew Books
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//
//           {/* History */}
//           <Card className="shadow-soft">
//             <CardHeader><CardTitle>Reading History</CardTitle></CardHeader>
//             <CardContent>
//               {history.length === 0 && (
//                   <p className="text-center text-muted-foreground py-4">No books returned yet.</p>
//               )}
//
//               <div className="space-y-3">
//                 {history.map((h, i) => (
//                     <div key={i} className="p-3 bg-muted rounded-lg">
//                       <p className="font-medium">{h.bookName}</p>
//                       <p className="text-sm text-muted-foreground">Returned on {h.returnDate}</p>
//                     </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//
//         </div>
//
//         {/* REQUEST BOOK MODAL */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Request a Book</DialogTitle>
//             </DialogHeader>
//
//             <Input
//                 placeholder="Search for a book..."
//                 value={searchBook}
//                 onChange={(e) => searchBooksLive(e.target.value)}
//             />
//
//             <div className="max-h-60 overflow-y-auto mt-3 space-y-2">
//               {filteredBooks.map((b) => (
//                   <div
//                       key={b.bookId}
//                       onClick={() => setSelectedBook(b)}
//                       className={`p-3 rounded-md border cursor-pointer ${
//                           selectedBook?.bookId === b.bookId
//                               ? "bg-primary text-white"
//                               : "bg-muted"
//                       }`}
//                   >
//                     <p className="font-medium">{b.bookName}</p>
//                     <p className="text-sm text-muted-foreground">{b.authorName}</p>
//                   </div>
//               ))}
//
//               {filteredBooks.length === 0 && (
//                   <p className="text-center text-sm text-muted-foreground py-2">
//                     No books found.
//                   </p>
//               )}
//             </div>
//
//             <Button className="w-full mt-4" onClick={requestIssue}>
//               Request Book
//             </Button>
//           </DialogContent>
//         </Dialog>
//
//       </div>
//   );
// };
//
// export default UserDashboard;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, Search, Clock, CheckCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Book {
  bookId: number;
  bookName: string;
  authorName: string;
}

interface MyBook {
  id: number;
  bookName: string;
  authorName: string;
  dueDate: string;
  issueDate: string;
  status: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();

  const [borrowed, setBorrowed] = useState<MyBook[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Request modal
  const [open, setOpen] = useState(false);
  const [searchBook, setSearchBook] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const userData = JSON.parse(localStorage.getItem("lms_user") || "null");
  // const userId = userData?.userId;
  const userId = JSON.parse(localStorage.getItem("lms_user")!).userId;


  // --------------------------------------------
  // LOAD DASHBOARD
  // --------------------------------------------
  // const loadDashboard = async () => {
  //   try {
  //     const myBooks = await apiFetch(`/user/issued/${userId}`);
  //     const allBooksApi = await apiFetch("/user/all-books");
  //     const requests = []; // user should not see librarian pending requests
  //
  //
  //     let hist: any[] = [];
  //     try {
  //       hist = await apiFetch(`/user/history/${userId}`);
  //     } catch {
  //       hist = [];
  //     }
  //
  //     // Normalize + only show approved
  //     const normalized = myBooks
  //         .filter((b: any) => ["APPROVED", "ISSUED", "ACTIVE"].includes(b.status))
  //         .map((b: any) => ({
  //           id: b.id,
  //           bookName: b.bookName,
  //           authorName: b.authorName,
  //           issueDate: b.issueDate ? String(b.issueDate) : "Not Issued",
  //           dueDate: b.dueDate ? String(b.dueDate) : "No Due Date",
  //           returnDate: b.returnDate ? String(b.returnDate) : null,
  //           status: b.status,
  //           fine: b.fine ?? 0
  //         }));
  //
  //
  //     setBorrowed(normalized);
  //     setAllBooks(allBooksApi);
  //     // setPendingRequests(requests.length);
  //
  //     setPendingRequests(0);
  //
  //     setTotalBooks(allBooksApi.length);
  //     setHistory(hist);
  //
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to load dashboard");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadDashboard = async () => {
    try {
      const myBooks = await apiFetch(`/user/issued/${userId}`);
      const allBooksApi = await apiFetch("/user/all-books");

      let hist = [];
      try {
        hist = await apiFetch(`/user/history/${userId}`);
      } catch {}

      const normalized = myBooks
          .filter((b: any) =>
              ["APPROVED", "ISSUED", "ACTIVE"].includes(b.status)
          )
          .map((b: any) => ({
            ...b,
            dueDate: b.dueDate ?? "No Due Date",
            issueDate: b.issueDate ?? "Not Issued",
          }));

      setBorrowed(normalized);
      setAllBooks(allBooksApi);
      setTotalBooks(allBooksApi.length);
      setPendingRequests(0);
      setHistory(hist);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };


  // --------------------------------------------
  // LIVE SEARCH
  // --------------------------------------------
  const searchBooksLive = async (keyword: string) => {
    setSearchBook(keyword);

    if (keyword.trim() === "") {
      setAllBooks([]);
      return;
    }

    try {
      const res = await apiFetch(`/user/search?keyword=${keyword}`);
      setAllBooks(res);
    } catch {
      setAllBooks([]);
    }
  };

  // --------------------------------------------
  // SEND BOOK REQUEST
  // --------------------------------------------
  const requestIssue = async () => {
    if (!selectedBook) return toast.error("Select a book first");

    try {
      await apiFetch("/user/request-book", {
        method: "POST",
        body: JSON.stringify({
          userId,
          bookId: selectedBook.bookId,
        }),
      });

      toast.success(`Issue request sent for: ${selectedBook.bookName}`);
      setOpen(false);
      setSelectedBook(null);
      setSearchBook("");
      setAllBooks([]);

      loadDashboard();
    } catch {
      toast.error("Failed to send request");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg font-semibold">Loading your dashboard...</div>;
  }

  const stats = [
    { title: "Books Borrowed", value: borrowed.length, icon: BookMarked, color: "text-primary" },
    { title: "Pending Requests", value: pendingRequests, icon: Clock, color: "text-destructive" },
    { title: "Books Returned", value: history.length, icon: CheckCircle, color: "text-accent" },
    { title: "Available Books", value: totalBooks, icon: Search, color: "text-secondary" },
  ];

  return (
      <div className="p-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Track your books & requests.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
              <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Borrowed Books */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Currently Borrowed Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {borrowed.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">You haven't borrowed any books yet.</p>
              )}

              {borrowed.map((book) => (
                  <div
                      key={book.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{book.bookName}</p>
                      <p className="text-sm text-muted-foreground">{book.authorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Due: {book.dueDate}</p>
                      <Badge variant="default">Borrowed</Badge>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions + History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full p-3 text-left" onClick={() => setOpen(true)}>Request a Book</Button>
                <Button className="w-full p-3 text-left bg-secondary" onClick={() => navigate("/user/my-books")}>View My Books</Button>
                <Button className="w-full p-3 text-left bg-accent text-accent-foreground"
                        onClick={() => navigate("/user/my-books")}>
                  Renew Books
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="shadow-soft">
            <CardHeader><CardTitle>Reading History</CardTitle></CardHeader>
            <CardContent>
              {history.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No books returned yet.</p>
              )}

              <div className="space-y-3">
                {history.map((h, i) => (
                    <div key={i} className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">{h.bookName}</p>
                      <p className="text-sm text-muted-foreground">Returned on {h.returnDate}</p>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* REQUEST BOOK MODAL */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Book</DialogTitle>
            </DialogHeader>

            <Input
                placeholder="Search for a book..."
                value={searchBook}
                onChange={(e) => searchBooksLive(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto mt-3 space-y-2">
              {allBooks.map((b) => (
                  <div
                      key={b.bookId}
                      onClick={() => setSelectedBook(b)}
                      className={`p-3 rounded-md border cursor-pointer ${
                          selectedBook?.bookId === b.bookId ? "bg-primary text-white" : "bg-muted"
                      }`}
                  >
                    <p className="font-medium">{b.bookName}</p>
                    <p className="text-sm text-muted-foreground">{b.authorName}</p>
                  </div>
              ))}

              {allBooks.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-2">No books found.</p>
              )}
            </div>

            <Button className="w-full mt-4" onClick={requestIssue}>Request Book</Button>
          </DialogContent>
        </Dialog>

      </div>
  );
};

export default UserDashboard;
