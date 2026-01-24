// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { apiFetch } from "@/lib/api";
//
// const Reports = () => {
//   const [issuedBooks, setIssuedBooks] = useState<any[]>([]);
//   const [overdueBooks, setOverdueBooks] = useState<any[]>([]);
//   const [popularBooks, setPopularBooks] = useState<any[]>([]);
//
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     loadReports();
//   }, []);
//
//   const loadReports = async () => {
//     try {
//       const [issued, overdue, popular] = await Promise.all([
//         apiFetch("/admin/reports/issued"),
//         apiFetch("/admin/reports/overdue"),
//         apiFetch("/admin/reports/popular"),
//       ]);
//
//       setIssuedBooks(issued);
//       setOverdueBooks(overdue);
//       setPopularBooks(popular);
//     } catch (err) {
//       console.error("Error loading reports:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   if (loading) return <p className="p-8">Loading reports...</p>;
//
//   return (
//       <div className="p-8 space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Reports</h1>
//           <p className="text-muted-foreground mt-1">View library statistics and reports</p>
//         </div>
//
//         <Tabs defaultValue="issued" className="space-y-6">
//           <TabsList>
//             <TabsTrigger value="issued">Issued Books</TabsTrigger>
//             <TabsTrigger value="overdue">Overdue Books</TabsTrigger>
//             <TabsTrigger value="popular">Popular Books</TabsTrigger>
//           </TabsList>
//
//           {/* ---------------- Issued Books ---------------- */}
//           <TabsContent value="issued">
//             <Card className="shadow-soft">
//               <CardHeader>
//                 <CardTitle>Currently Issued Books</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Book Title</TableHead>
//                       <TableHead>Issued To</TableHead>
//                       <TableHead>Issue Date</TableHead>
//                       <TableHead>Due Date</TableHead>
//                     </TableRow>
//                   </TableHeader>
//
//                   <TableBody>
//                     {issuedBooks.length === 0 && (
//                         <TableRow>
//                           <TableCell colSpan={4} className="text-center text-muted-foreground">
//                             No issued books found
//                           </TableCell>
//                         </TableRow>
//                     )}
//
//                     {issuedBooks.map((b, i) => (
//                         <TableRow key={i}>
//                           <TableCell className="font-medium">{b.bookTitle}</TableCell>
//                           <TableCell>{b.userName}</TableCell>
//                           <TableCell className="text-muted-foreground">{b.issueDate}</TableCell>
//                           <TableCell className="text-muted-foreground">{b.dueDate}</TableCell>
//                         </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>
//
//           {/* ---------------- Overdue Books ---------------- */}
//           <TabsContent value="overdue">
//             <Card className="shadow-soft">
//               <CardHeader>
//                 <CardTitle>Overdue Books</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Book Title</TableHead>
//                       <TableHead>Borrowed By</TableHead>
//                       <TableHead>Issue Date</TableHead>
//                       <TableHead>Due Date</TableHead>
//                       <TableHead>Days Overdue</TableHead>
//                     </TableRow>
//                   </TableHeader>
//
//                   <TableBody>
//                     {overdueBooks.length === 0 && (
//                         <TableRow>
//                           <TableCell colSpan={5} className="text-center text-muted-foreground">
//                             No overdue books
//                           </TableCell>
//                         </TableRow>
//                     )}
//
//                     {overdueBooks.map((b, i) => (
//                         <TableRow key={i}>
//                           <TableCell className="font-medium">{b.bookTitle}</TableCell>
//                           <TableCell>{b.userName}</TableCell>
//                           <TableCell className="text-muted-foreground">{b.issueDate}</TableCell>
//                           <TableCell className="text-destructive">{b.dueDate}</TableCell>
//                           <TableCell>
//                             <Badge variant="destructive">{b.daysOverdue} days</Badge>
//                           </TableCell>
//                         </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>
//
//           {/* ---------------- Popular Books ---------------- */}
//           <TabsContent value="popular">
//             <Card className="shadow-soft">
//               <CardHeader>
//                 <CardTitle>Most Popular Books</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Rank</TableHead>
//                       <TableHead>Book Title</TableHead>
//                       <TableHead>Author</TableHead>
//                       <TableHead>Total Issues</TableHead>
//                     </TableRow>
//                   </TableHeader>
//
//                   <TableBody>
//                     {popularBooks.length === 0 && (
//                         <TableRow>
//                           <TableCell colSpan={4} className="text-center text-muted-foreground">
//                             No popular books found
//                           </TableCell>
//                         </TableRow>
//                     )}
//
//                     {popularBooks.map((b, index) => (
//                         <TableRow key={index}>
//                           <TableCell className="font-medium">#{index + 1}</TableCell>
//                           <TableCell className="font-medium">{b.title}</TableCell>
//                           <TableCell className="text-muted-foreground">{b.author}</TableCell>
//                           <TableCell>
//                             <Badge variant="secondary">{b.issueCount} issues</Badge>
//                           </TableCell>
//                         </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//   );
// };
//
// export default Reports;

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

const Reports = () => {
  const [issuedBooks, setIssuedBooks] = useState<any[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<any[]>([]);
  const [popularBooks, setPopularBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const issued = await apiFetch("/admin/reports/issued");
      const overdue = await apiFetch("/admin/reports/overdue");
      const popular = await apiFetch("/admin/reports/popular");

      setIssuedBooks(issued || []);
      setOverdueBooks(overdue || []);
      setPopularBooks(popular || []);
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) return <p className="p-8">Loading reports...</p>;

  return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">
            View library statistics and reports
          </p>
        </div>

        <Tabs defaultValue="issued" className="space-y-6">
          <TabsList>
            <TabsTrigger value="issued">Issued Books</TabsTrigger>
            <TabsTrigger value="overdue">Overdue Books</TabsTrigger>
            <TabsTrigger value="popular">Popular Books</TabsTrigger>
          </TabsList>

          {/* ---------------- Issued Books ---------------- */}
          <TabsContent value="issued">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Currently Issued Books</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Issued To</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {issuedBooks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No issued books
                          </TableCell>
                        </TableRow>
                    )}

                    {issuedBooks.map((b, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{b.bookTitle}</TableCell>
                          <TableCell>{b.userName}</TableCell>
                          <TableCell>{b.issueDate}</TableCell>
                          <TableCell>{b.dueDate}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- Overdue Books ---------------- */}
          <TabsContent value="overdue">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Overdue Books</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrowed By</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {overdueBooks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No overdue books
                          </TableCell>
                        </TableRow>
                    )}

                    {overdueBooks.map((b, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{b.bookTitle}</TableCell>
                          <TableCell>{b.userName}</TableCell>
                          <TableCell>{b.issueDate}</TableCell>
                          <TableCell>{b.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">{b.daysOverdue} days</Badge>
                          {/*</Badge>*/}
                        </TableCell>
                      </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- Popular Books ---------------- */}
          <TabsContent value="popular">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Most Popular Books</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Total Issues</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {popularBooks.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No popular books found
                          </TableCell>
                        </TableRow>
                    )}

                    {popularBooks.map((b, index) => (
                        <TableRow key={index}>
                          <TableCell>#{index + 1}</TableCell>
                          <TableCell>{b.title}</TableCell>
                          <TableCell>{b.author}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{b.issueCount}</Badge>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default Reports;
