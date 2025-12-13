import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "sonner";
import {
  TrendingUp,
  Users,
  Target,
  LogOut,
  User,
  Settings,
  BarChart3,
  Flame,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { clearSession, authFetch } from "../lib/auth";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    conversionRate: 0,
    hotLeads: 0,
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Failed to parse user data");
      }
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await authFetch("/api/admin/dashboard/stats", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Gagal memuat data dashboard");
      }

      const data = await response.json();
      const statsData = data.stats || {};

      // Find hot leads count from leadsByBucket
      const hotLeadsCount =
        statsData.leadsByBucket?.find((item) => item.bucket === "hot")?.count ||
        0;

      setStats({
        totalLeads: statsData.totalLeads || 0,
        conversionRate: statsData.conversionRate || 0,
        hotLeads: hotLeadsCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    toast.success("Logout berhasil");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat data admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" data-testid="admin-dashboard-page">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold heading-font gradient-text">
                  SalesForce Nexus
                </h1>
                <p className="text-xs text-gray-600">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                <User className="w-4 h-4 text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "admin"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="btn-scale"
                data-testid="admin-logout-button"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold heading-font text-gray-900 mb-2">
            Selamat datang, {user?.name || "Admin"}
          </h2>
          <p className="text-gray-600">
            Kelola sistem dan pantau performa aplikasi SalesForce Nexus
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="card-hover border-l-4 border-l-blue-500"
            data-testid="admin-total-leads"
          >
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Total Leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-gray-900">
                {stats.totalLeads}
              </p>
            </CardContent>
          </Card>

          <Card
            className="card-hover border-l-4 border-l-emerald-500"
            data-testid="admin-conversion-rate"
          >
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4" />
                Conversion Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-gray-900">
                {stats.conversionRate}%
              </p>
            </CardContent>
          </Card>

          <Card
            className="card-hover border-l-4 border-l-amber-500"
            data-testid="admin-hot-leads"
          >
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Hot Leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-gray-900">
                {stats.hotLeads}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user?.role === "super_admin" && (
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 heading-font">
                  <Users className="w-5 h-5" />
                  Admin Management
                </CardTitle>
                <CardDescription>Kelola semua akun admin</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/super-admin/users")}
                  data-testid="manage-admin-button"
                >
                  Kelola
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 heading-font">
                <Users className="w-5 h-5" />
                Sales Management
              </CardTitle>
              <CardDescription>Kelola semua akun sales</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/admin/sales")}
                data-testid="manage-sales-button"
              >
                Kelola
              </Button>
            </CardContent>
          </Card>

          {/* <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 heading-font">
                <Settings className="w-5 h-5" />
                Pengaturan Sistem
              </CardTitle>
              <CardDescription>
                Konfigurasi aplikasi dan parameter sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Buka Pengaturan
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 heading-font">
                <BarChart3 className="w-5 h-5" />
                Analytics & Reports
              </CardTitle>
              <CardDescription>
                Lihat laporan dan statistik performa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Buka Analytics
              </Button>
            </CardContent>
          </Card> */}

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 heading-font">
                <Target className="w-5 h-5" />
                Leads & Customer Management
              </CardTitle>
              <CardDescription>
                Kelola semua leads & customer di sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/admin/customers")}
              >
                Kelola
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
