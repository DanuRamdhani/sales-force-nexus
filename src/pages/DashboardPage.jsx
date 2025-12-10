import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import {
  Search,
  Filter,
  TrendingUp,
  Users,
  Target,
  Award,
  LogOut,
  User,
  Flame,
  Wind,
  Snowflake,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { clearSession, authFetch, getStoredUser } from "../lib/auth";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    bucket: "",
    status: "",
    job: "",
    has_loan: "",
  });

  // Stats computed from leads data
  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.score?.bucket === "hot").length,
    warm: leads.filter((l) => l.score?.bucket === "warm").length,
    closedWon: leads.filter((l) => l.status === "closed_won").length,
  };

  // Transform API response to expected component structure
  const transformLeads = (apiLeads) => {
    return apiLeads.map((lead) => ({
      id: lead.lead_id,
      customer: {
        name: lead.customer_name,
        age: lead.age,
        job: lead.job,
        balance: lead.balance,
        has_loan: lead.loan,
      },
      score: {
        score: parseFloat(lead.score),
        bucket: lead.bucket,
        explanation: lead.explanation,
      },
      status: lead.status,
    }));
  };

  const dummyLeads = [
    // Dummy data for leads (will be replaced with real API data)
    {
      id: 1,
      customer: {
        name: "Andi Wijaya",
        age: 30,
        job: "management.",
        balance: 1500000,
      },
      score: {
        score: 0.85,
        bucket: "hot",
        explanation:
          "Peluang tinggi untuk konversi karena profil keuangan yang kuat.",
      },
      status: "in_progress",
    },
    {
      id: 2,
      customer: {
        name: "Siti Aminah",
        age: 45,
        job: "technician.",
        balance: 800000,
      },
      score: {
        score: 0.6,
        bucket: "warm",
        explanation: "Peluang sedang, perlu pendekatan lebih lanjut.",
      },
      status: "new",
    },
    {
      id: 3,
      customer: {
        name: "Budi Santoso",
        age: 38,
        job: "entrepreneur.",
        balance: 500000,
      },
      score: {
        score: 0.3,
        bucket: "cold",
        explanation: "Peluang rendah, profil keuangan kurang mendukung.",
      },
      status: "closed_lost",
    },
    {
      id: 4,
      customer: {
        name: "Lina Marlina",
        age: 29,
        job: "services.",
        balance: 1200000,
      },
      score: {
        score: 0.75,
        bucket: "warm",
        explanation: "Peluang baik, tetapi butuh lebih banyak informasi.",
      },
      status: "in_progress",
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch current user from API
      const userResponse = await authFetch("/api/me", {
        method: "GET",
      });

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          throw new Error(
            "Silakan login terlebih dahulu untuk mengakses dashboard"
          );
        }
        throw new Error("Gagal memuat data user");
      }

      const userData = await userResponse.json();
      if (userData?.user) {
        setUser(userData.user);
      }

      // Fetch leads data from API
      const leadsResponse = await authFetch("/api/sales/leads", {
        method: "GET",
      });

      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        if (Array.isArray(leadsData)) {
          setLeads(transformLeads(leadsData));
        } else if (Array.isArray(leadsData.data)) {
          setLeads(transformLeads(leadsData.data));
        }
      } else {
        // Fallback to dummy data if API unavailable
        setLeads(dummyLeads);
      }
    } catch (error) {
      const isLoginError = error.message.includes(
        "Silakan login terlebih dahulu"
      );
      toast.error(error.message || "Gagal memuat data dashboard");

      if (error.message === "Gagal memuat data user" || isLoginError) {
        handleLogout();
      } else {
        // Fallback to dummy leads on error
        setLeads(dummyLeads);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const getBucketIcon = (bucket) => {
    switch (bucket) {
      case "hot":
        return <Flame className="w-4 h-4" />;
      case "warm":
        return <Wind className="w-4 h-4" />;
      case "cold":
        return <Snowflake className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "closed_won":
        return <CheckCircle className="w-4 h-4" />;
      case "closed_lost":
        return <XCircle className="w-4 h-4" />;
      case "in_progress":
        return <Clock className="w-4 h-4" />;
      case "new":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter and search leads
  const filteredLeads = leads.filter((lead) => {
    // Search by customer name
    if (
      searchQuery &&
      !lead.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by bucket
    if (
      filters.bucket &&
      filters.bucket !== " " &&
      lead.score.bucket !== filters.bucket
    ) {
      return false;
    }

    // Filter by status
    if (
      filters.status &&
      filters.status !== " " &&
      lead.status !== filters.status
    ) {
      return false;
    }

    // Filter by job
    if (
      filters.job &&
      filters.job !== " " &&
      lead.customer.job.toLowerCase() !== filters.job.toLowerCase()
    ) {
      return false;
    }

    // Filter by loan status
    if (
      filters.has_loan &&
      filters.has_loan !== " " &&
      lead.customer.has_loan !== filters.has_loan
    ) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" data-testid="dashboard-page">
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
                <p className="text-xs text-gray-600">Lead Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                <User className="w-4 h-4 text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="btn-scale"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card
            className="card-hover border-l-4 border-l-emerald-500"
            data-testid="stat-total-leads"
          >
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-gray-900">
                {stats.total}
              </p>
            </CardContent>
          </Card>

          <Card
            className="card-hover border-l-4 border-l-red-500"
            data-testid="stat-hot-leads"
          >
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                Hot Leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-red-600">
                {stats.hot}
              </p>
            </CardContent>
          </Card>

          <Card
            className="card-hover border-l-4 border-l-amber-500"
            data-testid="stat-warm-leads"
          >
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-amber-500" />
                Warm Leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-amber-600">
                {stats.warm}
              </p>
            </CardContent>
          </Card>

          <Card
            className="card-hover border-l-4 border-l-emerald-500"
            data-testid="stat-closed-won"
          >
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" />
                Closed Won
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold heading-font text-emerald-600">
                {stats.closedWon}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-6 glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="heading-font">
                  Daftar Lead Prioritas
                </CardTitle>
                <CardDescription>
                  Lead diurutkan berdasarkan skor tertinggi
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Cari nama nasabah..."
                data-testid="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select
                value={filters.bucket}
                onValueChange={(value) =>
                  setFilters({ ...filters, bucket: value })
                }
              >
                <SelectTrigger data-testid="filter-bucket">
                  <SelectValue placeholder="Semua Bucket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Semua Bucket</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger data-testid="filter-status">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Semua Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="closed_lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.job}
                onValueChange={(value) =>
                  setFilters({ ...filters, job: value })
                }
              >
                <SelectTrigger data-testid="filter-job">
                  <SelectValue placeholder="Semua Pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Semua Pekerjaan</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                  <SelectItem value="blue-collar">Blue Collar</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.has_loan}
                onValueChange={(value) =>
                  setFilters({ ...filters, has_loan: value })
                }
              >
                <SelectTrigger data-testid="filter-loan">
                  <SelectValue placeholder="Status Pinjaman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Semua</SelectItem>
                  <SelectItem value="yes">Punya Pinjaman</SelectItem>
                  <SelectItem value="no">Tidak Punya Pinjaman</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <div className="space-y-3">
          {filteredLeads.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada lead ditemukan</p>
              </CardContent>
            </Card>
          ) : (
            filteredLeads.map((lead, index) => (
              <Card
                key={lead.id}
                className="card-hover cursor-pointer animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/leads/${lead.id}`)}
                data-testid={`lead-card-${lead.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Score Badge */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                            lead.score.bucket === "hot"
                              ? "bg-gradient-to-br from-red-500 to-red-600"
                              : lead.score.bucket === "warm"
                              ? "bg-gradient-to-br from-amber-500 to-amber-600"
                              : "bg-gradient-to-br from-blue-500 to-blue-600"
                          }`}
                        >
                          {getBucketIcon(lead.score.bucket)}
                          <span className="text-white text-lg font-bold">
                            {(lead.score.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {lead.customer.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span>{lead.customer.age} tahun</span>
                          <span className="text-gray-300">•</span>
                          <span className="capitalize">
                            {lead.customer.job.replace(".", "")}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{formatCurrency(lead.customer.balance)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {lead.score.explanation}
                        </p>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        className={`badge-${lead.score.bucket} flex items-center gap-1`}
                      >
                        {getBucketIcon(lead.score.bucket)}
                        {lead.score.bucket}
                      </span>
                      <span
                        className={`status-${lead.status.replace(
                          "_",
                          "-"
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(lead.status)}
                        {lead.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
