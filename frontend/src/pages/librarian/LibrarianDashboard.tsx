// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BookOpen, BookMarked, CheckCircle, Clock } from "lucide-react";
// import { apiFetch } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
//
// interface IssueRequest {
//   id: number;
//   bookName: string;
//   userName: string;
//   requestDate: string;
// }
//
// const LibrarianDashboard = () => {
//   const navigate = useNavigate();
//
//   const [pending, setPending] = useState<IssueRequest[]>([]);
//   const [totalBooks, setTotalBooks] = useState(0);
//   const [issuedCount, setIssuedCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//
//   // 🔥 LOAD DASHBOARD DATA
//   const loadDashboard = async () => {
//     try {
//       const books = await apiFetch("/librarian/all-books");
//       const requests = await apiFetch("/librarian/pending-requests");
//       const issued = await apiFetch("/librarian/all-issued");
//
//       setTotalBooks(Array.isArray(books) ? books.length : 0);
//       setPending(Array.isArray(requests) ? requests : []);
//       setIssuedCount(Array.isArray(issued) ? issued.length : 0);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // 🔥 APPROVE REQUEST
//   const handleApprove = async (id: number) => {
//     try {
//       await apiFetch(`/librarian/approve/${id}`, { method: "POST" });
//       toast.success("Request approved");
//
//       loadDashboard();
//     } catch {
//       toast.error("Failed to approve request");
//     }
//   };
//
//   // 🔥 REJECT REQUEST
//   const handleReject = async (id: number) => {
//     try {
//       await apiFetch(`/librarian/reject/${id}`, { method: "POST" });
//       toast.error("Request rejected");
//
//       loadDashboard();
//     } catch {
//       toast.error("Failed to reject request");
//     }
//   };
//
//   // 🔥 INITIAL LOAD
//   useEffect(() => {
//     loadDashboard();
//
//     // Listen for "booksUpdated" event from Add Book page
//     const reloadHandler = () => loadDashboard();
//     window.addEventListener("booksUpdated", reloadHandler);
//
//     return () => window.removeEventListener("booksUpdated", reloadHandler);
//   }, []);
//
//   if (loading) {
//     return (
//         <div className="p-8 text-center text-lg font-semibold">
//           Loading dashboard...
//         </div>
//     );
//   }
//
//   const stats = [
//     { title: "Total Books", value: totalBooks, icon: BookOpen, color: "text-primary" },
//     { title: "Pending Requests", value: pending.length, icon: Clock, color: "text-destructive" },
//     { title: "Books Issued", value: issuedCount, icon: BookMarked, color: "text-secondary" },
//     { title: "Returned Today", value: 0, icon: CheckCircle, color: "text-accent" },
//   ];
//
//   return (
//       <div className="p-8 space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Librarian Dashboard</h1>
//           <p className="text-muted-foreground mt-1">Manage books and issue requests</p>
//         </div>
//
//         {/* 📌 Stats Section */}
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
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//
//           {/* 📌 Pending Requests */}
//           <Card className="shadow-soft">
//             <CardHeader>
//               <CardTitle className="flex justify-between items-center">
//                 <span>Pending Issue Requests</span>
//                 <Badge variant="secondary">{pending.length}</Badge>
//               </CardTitle>
//             </CardHeader>
//
//             <CardContent>
//               <div className="space-y-3">
//                 {pending.length === 0 && (
//                     <p className="text-center text-muted-foreground py-4">No pending requests</p>
//                 )}
//
//                 {pending.map((req) => (
//                     <div
//                         key={req.id}
//                         className="flex items-center justify-between p-4 bg-muted rounded-lg"
//                     >
//                       <div>
//                         <p className="font-medium">{req.bookName}</p>
//                         <p className="text-sm text-muted-foreground">
//                           Requested by: {req.userName}
//                         </p>
//                       </div>
//
//                       <div className="flex gap-2">
//                         <Button size="sm" onClick={() => handleApprove(req.id)}>
//                           Approve
//                         </Button>
//                         <Button size="sm" variant="destructive" onClick={() => handleReject(req.id)}>
//                           Reject
//                         </Button>
//                       </div>
//                     </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//
//           {/* 📌 Quick Actions */}
//           <Card className="shadow-soft">
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//
//                 {/* Navigate to Add Book */}
//                 <Button
//                     className="w-full py-4 text-left whitespace-normal"
//                     onClick={() => navigate("/librarian/books")}
//                 >
//                   Add New Book
//                 </Button>
//
//                 {/* Navigate to Requests */}
//                 <Button
//                     className="w-full py-4 text-left whitespace-normal"
//                     variant="secondary"
//                     onClick={() => navigate("/librarian/requests")}
//                 >
//                   View All Requests
//                 </Button>
//
//                 {/* Navigate to Issued Books */}
//                 <Button
//                     className="w-full py-4 text-left whitespace-normal"
//                     variant="outline"
//                     onClick={() => navigate("/librarian/issued")}
//                 >
//                   Process Returns
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//   );
// };
//
// export default LibrarianDashboard;
//


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookMarked, CheckCircle, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface IssueRequest {
  id: number;
  bookName: string;
  userName: string;
  status: string;           // <= IMPORTANT
  requestDate: string;
}

const LibrarianDashboard = () => {
  const navigate = useNavigate();

  const [pending, setPending] = useState<IssueRequest[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [issuedCount, setIssuedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ---------------- LOAD DASHBOARD ----------------
  const loadDashboard = async () => {
    try {
      const books = await apiFetch("/librarian/all-books");
      const requests = await apiFetch("/librarian/pending-requests");
      const issued = await apiFetch("/librarian/all-issued");

      setTotalBooks(Array.isArray(books) ? books.length : 0);
      setPending(Array.isArray(requests) ? requests : []);
      setIssuedCount(Array.isArray(issued) ? issued.length : 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- APPROVE NORMAL REQUEST ----------------
  const handleApprove = async (id: number) => {
    try {
      await apiFetch(`/librarian/approve/${id}`, { method: "POST" });
      toast.success("Request approved");
      loadDashboard();
    } catch {
      toast.error("Failed to approve request");
    }
  };

  // ---------------- REJECT NORMAL REQUEST ----------------
  const handleReject = async (id: number) => {
    try {
      await apiFetch(`/librarian/reject/${id}`, { method: "POST" });
      toast.error("Request rejected");
      loadDashboard();
    } catch {
      toast.error("Failed to reject request");
    }
  };

  // ---------------- APPROVE RENEWAL ----------------
  const handleRenewApprove = async (id: number) => {
    try {
      await apiFetch(`/librarian/renewal/approve/${id}`, { method: "POST" });
      toast.success("Renewal approved");
      loadDashboard();
    } catch {
      toast.error("Failed to approve renewal request");
    }
  };

  // ---------------- REJECT RENEWAL ----------------
  const handleRenewReject = async (id: number) => {
    try {
      await apiFetch(`/librarian/renewal/reject/${id}`, { method: "POST" });
      toast.error("Renewal rejected");
      loadDashboard();
    } catch {
      toast.error("Failed to reject renewal request");
    }
  };

  // ---------------- ON LOAD ----------------
  useEffect(() => {
    loadDashboard();

    const reloadHandler = () => loadDashboard();
    window.addEventListener("booksUpdated", reloadHandler);

    return () => window.removeEventListener("booksUpdated", reloadHandler);
  }, []);

  if (loading) {
    return (
        <div className="p-8 text-center text-lg font-semibold">
          Loading dashboard...
        </div>
    );
  }

  const stats = [
    { title: "Total Books", value: totalBooks, icon: BookOpen, color: "text-primary" },
    { title: "Pending Requests", value: pending.length, icon: Clock, color: "text-destructive" },
    { title: "Books Issued", value: issuedCount, icon: BookMarked, color: "text-secondary" },
    { title: "Returned Today", value: 0, icon: CheckCircle, color: "text-accent" },
  ];

  return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Librarian Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage books and issue requests</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
              <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PENDING REQUESTS */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Pending Requests</span>
                <Badge variant="secondary">{pending.length}</Badge>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {pending.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No pending requests</p>
                )}

                {pending.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{req.bookName}</p>
                        <p className="text-sm text-muted-foreground">
                          Requested by: {req.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Request Type: <strong>{req.status}</strong>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {/* ---------- NORMAL REQUEST ---------- */}
                        {req.status === "PENDING" && (
                            <>
                              <Button size="sm" onClick={() => handleApprove(req.id)}>Approve</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(req.id)}>Reject</Button>
                            </>
                        )}

                        {/* ---------- RENEWAL REQUEST ---------- */}
                        {req.status === "RENEWAL_PENDING" && (
                            <>
                              <Button size="sm" onClick={() => handleRenewApprove(req.id)}>Approve Renewal</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleRenewReject(req.id)}>Reject Renewal</Button>
                            </>
                        )}
                      </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QUICK ACTIONS */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full py-4" onClick={() => navigate("/librarian/books")}>
                  Add New Book
                </Button>

                <Button className="w-full py-4" variant="secondary" onClick={() => navigate("/librarian/requests")}>
                  View All Requests
                </Button>

                <Button className="w-full py-4" variant="outline" onClick={() => navigate("/librarian/issued")}>
                  Process Returns
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
  );
};

export default LibrarianDashboard;
