import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import {
  TrendingUp, Users, Target, LogOut, User, Settings, BarChart3
} from "lucide-react";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      toast.error("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout berhasil");
    navigate("/admin/login");
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
                <h1 className="text-xl font-bold heading-font gradient-text">SalesForce Nexus</h1>
                <p className="text-xs text-gray-600">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                <User className="w-4 h-4 text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || "admin"}</p>
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
          <p className="text-gray-600">Kelola sistem dan pantau performa aplikasi SalesForce Nexus</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover border-l-4 border-l-emerald-500" data-testid="admin-total-users">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-gray-900">124</p>
              <p className="text-xs text-gray-500 mt-1">+5 minggu ini</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-l-4 border-l-blue-500" data-testid="admin-total-leads">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Total Leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-gray-900">1,250</p>
              <p className="text-xs text-gray-500 mt-1">+89 minggu ini</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-l-4 border-l-amber-500" data-testid="admin-open-tickets">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Open Tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-gray-900">23</p>
              <p className="text-xs text-gray-500 mt-1">3 urgent</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 heading-font">
                <Users className="w-5 h-5" />
                Manajemen Pengguna
              </CardTitle>
              <CardDescription>
                Kelola akun pengguna, peran, dan permission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                disabled
              >
                Kelola Pengguna
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
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
              <Button
                variant="outline"
                className="w-full"
                disabled
              >
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
              <Button
                variant="outline"
                className="w-full"
                disabled
              >
                Buka Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 heading-font">
                <Target className="w-5 h-5" />
                Lead Management
              </CardTitle>
              <CardDescription>
                Kelola semua lead di sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Lihat Dashboard Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
