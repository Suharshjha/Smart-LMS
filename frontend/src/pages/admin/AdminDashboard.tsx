// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Users, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
//
// const AdminDashboard = () => {
//   const stats = [
//     { title: 'Total Users', value: '1,234', icon: Users, color: 'text-primary' },
//     { title: 'Total Books', value: '5,678', icon: BookOpen, color: 'text-accent' },
//     { title: 'Books Issued', value: '234', icon: TrendingUp, color: 'text-secondary' },
//     { title: 'Overdue Books', value: '12', icon: AlertCircle, color: 'text-destructive' },
//   ];
//
//   return (
//     <div className="p-8 space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
//         <p className="text-muted-foreground mt-1">Welcome back, manage your library system</p>
//       </div>
//
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat) => (
//           <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-smooth">
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 {stat.title}
//               </CardTitle>
//               <stat.icon className={`h-5 w-5 ${stat.color}`} />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="shadow-soft">
//           <CardHeader>
//             <CardTitle>Recent Activities</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                 <div>
//                   <p className="font-medium">New User Registration</p>
//                   <p className="text-sm text-muted-foreground">John Doe joined</p>
//                 </div>
//                 <span className="text-xs text-muted-foreground">2 hours ago</span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                 <div>
//                   <p className="font-medium">Book Added</p>
//                   <p className="text-sm text-muted-foreground">The Great Gatsby</p>
//                 </div>
//                 <span className="text-xs text-muted-foreground">5 hours ago</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//
//         <Card className="shadow-soft">
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <button className="w-full p-3 text-left bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth">
//                 Add New User
//               </button>
//               <button className="w-full p-3 text-left bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-smooth">
//                 Generate Report
//               </button>
//               <button className="w-full p-3 text-left bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-smooth">
//                 View All Statistics
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };
//
// export default AdminDashboard;

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/admin/dashboard-stats");
      // defensive: ensure data has fields (fallbacks)
      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalBooks: data.totalBooks ?? 0,
        issuedBooks: data.issuedBooks ?? data.issuedBooks ?? 0,
        overdueBooks: data.overdueBooks ?? 0,
      });
    } catch (e: any) {
      console.error("Failed to load dashboard stats:", e);
      setError(e?.message || "Failed to load dashboard stats");
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg font-medium">Loading dashboard...</div>;
  }

  if (error) {
    return (
        <div className="p-8 text-center space-y-4">
          <div className="text-lg font-medium text-destructive">Failed to load dashboard</div>
          <div className="text-muted-foreground">{error}</div>
          <div>
            <Button onClick={loadStats}>Retry</Button>
          </div>
        </div>
    );
  }

  const dashboardTiles = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-primary" },
    { title: "Total Books", value: stats.totalBooks, icon: BookOpen, color: "text-accent" },
    { title: "Books Issued", value: stats.issuedBooks, icon: TrendingUp, color: "text-secondary" },
    { title: "Overdue Books", value: stats.overdueBooks, icon: AlertCircle, color: "text-destructive" },
  ];

  return (
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, here is today's system overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardTiles.map((item) => (
              <Card key={item.title} className="shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Quick actions omitted for brevity */}
      </div>
  );
};

export default AdminDashboard;
