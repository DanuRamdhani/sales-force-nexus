import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Briefcase,
  Home,
  Wallet,
  TrendingUp,
  Calendar,
  Phone,
  Heart,
  CreditCard,
  Target,
  Flame,
  Wind,
  Snowflake,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { authFetch, clearSession } from "../lib/auth";

const CustomerDetailPage = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [leads, setLeads] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [leadForm, setLeadForm] = useState({
    contact_type: "cellular",
    last_contact_date: "",
    campaign: "1",
    previous_contacts: "0",
    prev_outcome: "unknown",
    status: "new",
  });

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetail();
    }
  }, [customerId]);

  const fetchCustomerDetail = async () => {
    try {
      const response = await authFetch(`/api/admin/customers/${customerId}`, {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
        } else if (response.status === 404) {
          toast.error("Customer tidak ditemukan");
          navigate("/admin/customers", { replace: true });
        }
        throw new Error("Gagal memuat detail customer");
      }

      const data = await response.json();
      setCustomer(data.customer);
      setLeads(data.leads || []);
    } catch (error) {
      toast.error(error.message || "Gagal memuat detail customer");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();

    if (!leadForm.last_contact_date) {
      toast.error("Tanggal kontak harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authFetch(`/api/admin/leads/${customerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact_type: leadForm.contact_type,
          last_contact_date: leadForm.last_contact_date,
          campaign: parseInt(leadForm.campaign),
          previous_contacts: parseInt(leadForm.previous_contacts),
          prev_outcome: leadForm.prev_outcome,
          status: leadForm.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat lead");
      }

      toast.success(data.message || "Lead berhasil dibuat");
      setDialogOpen(false);
      setLeadForm({
        contact_type: "cellular",
        last_contact_date: "",
        campaign: "1",
        previous_contacts: "0",
        prev_outcome: "unknown",
        status: "new",
      });
      await fetchCustomerDetail();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBucketColor = (bucket) => {
    switch (bucket) {
      case "hot":
        return "from-red-500 to-red-600";
      case "warm":
        return "from-amber-500 to-amber-600";
      case "cold":
        return "from-blue-500 to-blue-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getBucketIcon = (bucket) => {
    switch (bucket) {
      case "hot":
        return <Flame className="w-6 h-6" />;
      case "warm":
        return <Wind className="w-6 h-6" />;
      case "cold":
        return <Snowflake className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      new: { color: "bg-blue-100 text-blue-800", label: "Baru" },
      in_progress: { color: "bg-yellow-100 text-yellow-800", label: "Proses" },
      closed_won: { color: "bg-green-100 text-green-800", label: "Closed Won" },
      closed_lost: { color: "bg-red-100 text-red-800", label: "Closed Lost" },
    };
    return (
      statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat detail customer...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Customer tidak ditemukan</p>
            <Button className="mt-4">Kembali ke Daftar Customer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" data-testid="customer-detail-page">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/customers")}
              className="gap-1 sm:gap-2 text-sm sm:text-base"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-1 sm:gap-2 btn-scale text-sm sm:text-base"
                  data-testid="add-lead-button"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Lead</span>
                  <span className="sm:hidden">Tambah</span>
                </Button>
              </DialogTrigger>
              <DialogContent
                data-testid="create-lead-dialog"
                className="max-h-[90vh] overflow-y-auto"
              >
                <DialogHeader>
                  <DialogTitle>Tambah Lead Baru</DialogTitle>
                  <DialogDescription>
                    Buat lead baru untuk customer {customer.name}
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateLead}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="contact-type">Tipe Kontak</Label>
                      <Select
                        value={leadForm.contact_type}
                        onValueChange={(value) =>
                          setLeadForm({ ...leadForm, contact_type: value })
                        }
                      >
                        <SelectTrigger id="contact-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cellular">Cellular</SelectItem>
                          <SelectItem value="telephone">Telephone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last-contact">Tanggal Kontak *</Label>
                      <Input
                        id="last-contact"
                        type="date"
                        value={leadForm.last_contact_date}
                        onChange={(e) =>
                          setLeadForm({
                            ...leadForm,
                            last_contact_date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="campaign">Campaign</Label>
                      <Input
                        id="campaign"
                        type="number"
                        placeholder="1"
                        value={leadForm.campaign}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, campaign: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prev-contacts">Kontak Sebelumnya</Label>
                      <Input
                        id="prev-contacts"
                        type="number"
                        placeholder="0"
                        value={leadForm.previous_contacts}
                        onChange={(e) =>
                          setLeadForm({
                            ...leadForm,
                            previous_contacts: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prev-outcome">Hasil Sebelumnya</Label>
                      <Select
                        value={leadForm.prev_outcome}
                        onValueChange={(value) =>
                          setLeadForm({ ...leadForm, prev_outcome: value })
                        }
                      >
                        <SelectTrigger id="prev-outcome">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unknown">Unknown</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="failure">Failure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={leadForm.status}
                        onValueChange={(value) =>
                          setLeadForm({ ...leadForm, status: value })
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="closed_won">Closed Won</SelectItem>
                          <SelectItem value="closed_lost">
                            Closed Lost
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={submitting}
                  >
                    {submitting ? "Membuat..." : "Buat Lead"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Customer Info Card */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl heading-font">
              {customer.name}
            </CardTitle>
            <CardDescription>Detail informasi nasabah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Umur</p>
                  <p className="font-semibold text-gray-900">
                    {customer.age} tahun
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pekerjaan</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {customer.job.replace("-", " ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Saldo</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(customer.balance)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Home className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rumah</p>
                  <p className="font-semibold text-gray-900">
                    {customer.housing === "yes" ? "Memiliki" : "Tidak Memiliki"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pinjaman</p>
                  <p className="font-semibold text-gray-900">
                    {customer.loan === "yes" ? "Memiliki" : "Tidak Memiliki"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Default</p>
                  <p className="font-semibold text-gray-900">
                    {customer.has_default === "yes" ? "Ya" : "Tidak"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-bold heading-font mb-1">
              Leads ({leads.length})
            </h2>
            <p className="text-sm text-gray-600">
              Daftar leads untuk customer ini
            </p>
          </div>

          {leads.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Belum ada lead</p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Lead Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {leads.map((lead, index) => (
                <Card
                  key={lead.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  data-testid={`lead-card-${lead.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        {/* Score Badge */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center bg-gradient-to-br ${getBucketColor(
                              lead.latest_bucket
                            )}`}
                          >
                            {getBucketIcon(lead.latest_bucket)}
                            <span className="text-white text-sm font-bold">
                              {(lead.latest_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        {/* Lead Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              Lead #{lead.id}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                getStatusBadge(lead.status).color
                              }`}
                            >
                              {getStatusBadge(lead.status).label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {lead.contact_type}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(
                                new Date(lead.last_contact_date),
                                "dd MMM yyyy",
                                { locale: id }
                              )}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span>Campaign {lead.campaign}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Kontak sebelumnya: {lead.previous_contacts}x
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/leads/${lead.id}`)}
                          className="gap-1 text-xs sm:text-sm"
                          data-testid={`detail-lead-btn-${lead.id}`}
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Detail</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDetailPage;
