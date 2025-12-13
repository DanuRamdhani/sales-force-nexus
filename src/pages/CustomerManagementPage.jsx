import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Users,
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  User,
  Briefcase,
  Home,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { authFetch, clearSession } from "../lib/auth";

const CustomerManagementPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    age: "",
    job: "management",
    marital: "single",
    education: "unknown",
    has_default: "no",
    balance: "",
    housing: "no",
    loan: "no",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    job: "management",
    marital: "single",
    education: "unknown",
    has_default: "no",
    balance: "",
    housing: "no",
    loan: "no",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await authFetch("/api/admin/customers", {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memuat daftar customer");
      }

      const data = await response.json();
      setCustomers(data.data || []);
    } catch (error) {
      toast.error(error.message || "Gagal memuat daftar customer");
    } finally {
      setLoading(false);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      name: "",
      age: "",
      job: "management",
      marital: "single",
      education: "unknown",
      has_default: "no",
      balance: "",
      housing: "no",
      loan: "no",
    });
  };

  const resetEditForm = () => {
    setEditForm({
      name: "",
      age: "",
      job: "management",
      marital: "single",
      education: "unknown",
      has_default: "no",
      balance: "",
      housing: "no",
      loan: "no",
    });
    setSelectedCustomer(null);
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();

    if (!createForm.name || !createForm.age || !createForm.balance) {
      toast.error("Nama, umur, dan saldo harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authFetch("/api/admin/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createForm.name,
          age: parseInt(createForm.age),
          job: createForm.job,
          marital: createForm.marital,
          education: createForm.education,
          has_default: createForm.has_default,
          balance: parseFloat(createForm.balance),
          housing: createForm.housing,
          loan: createForm.loan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat customer");
      }

      toast.success(data.message || "Customer berhasil dibuat");
      setDialogOpen(false);
      resetCreateForm();
      await fetchCustomers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();

    if (!editForm.name || !editForm.age || !editForm.balance) {
      toast.error("Nama, umur, dan saldo harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authFetch(
        `/api/admin/customers/${selectedCustomer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editForm.name,
            age: parseInt(editForm.age),
            job: editForm.job,
            marital: editForm.marital,
            education: editForm.education,
            has_default: editForm.has_default,
            balance: parseFloat(editForm.balance),
            housing: editForm.housing,
            loan: editForm.loan,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah data customer");
      }

      toast.success(data.message || "Data customer berhasil diperbarui");
      setEditDialogOpen(false);
      resetEditForm();
      await fetchCustomers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    setSubmitting(true);
    try {
      const response = await authFetch(
        `/api/admin/customers/${selectedCustomer.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus customer");
      }

      toast.success(data.message || "Customer berhasil dihapus");
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
      await fetchCustomers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      name: customer.name,
      age: customer.age.toString(),
      job: customer.job,
      marital: customer.marital,
      education: customer.education,
      has_default: customer.has_default,
      balance: customer.balance.toString(),
      housing: customer.housing,
      loan: customer.loan,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const filteredCustomers = customers.filter((customer) => {
    if (
      searchQuery &&
      !customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat data customer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" data-testid="customer-management-page">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="gap-1 sm:gap-2 text-sm sm:text-base"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>

            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetCreateForm();
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-1 sm:gap-2 btn-scale text-sm sm:text-base"
                  data-testid="add-customer-button"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Customer</span>
                  <span className="sm:hidden">Tambah</span>
                </Button>
              </DialogTrigger>
              <DialogContent
                data-testid="create-customer-dialog"
                className="max-h-[90vh] overflow-y-auto"
              >
                <DialogHeader>
                  <DialogTitle>Tambah Customer Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan data nasabah baru ke sistem
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateCustomer}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="create-name">Nama Lengkap *</Label>
                      <Input
                        id="create-name"
                        placeholder="Contoh: Budi Santoso"
                        value={createForm.name}
                        onChange={(e) =>
                          setCreateForm({ ...createForm, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-age">Umur *</Label>
                      <Input
                        id="create-age"
                        type="number"
                        placeholder="35"
                        value={createForm.age}
                        onChange={(e) =>
                          setCreateForm({ ...createForm, age: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-job">Pekerjaan</Label>
                      <Select
                        value={createForm.job}
                        onValueChange={(value) =>
                          setCreateForm({ ...createForm, job: value })
                        }
                      >
                        <SelectTrigger id="create-job">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="management">Management</SelectItem>
                          <SelectItem value="technician">Technician</SelectItem>
                          <SelectItem value="entrepreneur">
                            Entrepreneur
                          </SelectItem>
                          <SelectItem value="blue-collar">
                            Blue Collar
                          </SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-marital">Status Perkawinan</Label>
                      <Select
                        value={createForm.marital}
                        onValueChange={(value) =>
                          setCreateForm({ ...createForm, marital: value })
                        }
                      >
                        <SelectTrigger id="create-marital">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-education">Pendidikan</Label>
                      <Select
                        value={createForm.education}
                        onValueChange={(value) =>
                          setCreateForm({ ...createForm, education: value })
                        }
                      >
                        <SelectTrigger id="create-education">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="illiterate">Illiterate</SelectItem>
                          <SelectItem value="basic.4y">
                            Basic (4 years)
                          </SelectItem>
                          <SelectItem value="basic.6y">
                            Basic (6 years)
                          </SelectItem>
                          <SelectItem value="basic.9y">
                            Basic (9 years)
                          </SelectItem>
                          <SelectItem value="high.school">
                            High School
                          </SelectItem>
                          <SelectItem value="professional.course">
                            Professional Course
                          </SelectItem>
                          <SelectItem value="university.degree">
                            University Degree
                          </SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-balance">Saldo *</Label>
                      <Input
                        id="create-balance"
                        type="number"
                        placeholder="1200.50"
                        value={createForm.balance}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            balance: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-default">Default</Label>
                      <Select
                        value={createForm.has_default}
                        onValueChange={(value) =>
                          setCreateForm({ ...createForm, has_default: value })
                        }
                      >
                        <SelectTrigger id="create-default">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Ya</SelectItem>
                          <SelectItem value="no">Tidak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-housing">Rumah</Label>
                      <Select
                        value={createForm.housing}
                        onValueChange={(value) =>
                          setCreateForm({ ...createForm, housing: value })
                        }
                      >
                        <SelectTrigger id="create-housing">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Ya</SelectItem>
                          <SelectItem value="no">Tidak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="create-loan">Pinjaman</Label>
                      <Select
                        value={createForm.loan}
                        onValueChange={(value) =>
                          setCreateForm({ ...createForm, loan: value })
                        }
                      >
                        <SelectTrigger id="create-loan">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Ya</SelectItem>
                          <SelectItem value="no">Tidak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={submitting}
                  >
                    {submitting ? "Membuat..." : "Buat Customer"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold heading-font gradient-text mb-2">
            Manajemen Customer
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Kelola data nasabah dan leads mereka
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-4 sm:mb-6 border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              Total Customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold heading-font text-gray-900">
              {customers.length}
            </p>
          </CardContent>
        </Card>

        {/* Search & Filter */}
        <Card className="mb-4 sm:mb-6 glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="heading-font text-lg sm:text-xl">
                  Daftar Customer
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Cari dan kelola data nasabah
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                placeholder="Cari nama customer..."
                data-testid="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <div className="space-y-3">
          {filteredCustomers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Belum ada customer</p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Customer Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredCustomers.map((customer, index) => (
              <Card
                key={customer.id}
                className="card-hover animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`customer-card-${customer.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1">
                          {customer.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <span>{customer.age} tahun</span>
                          <span className="text-gray-300">•</span>
                          <span className="capitalize">
                            {customer.job.replace("-", " ")}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{formatCurrency(customer.balance)}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-2">
                          {customer.housing === "yes" && (
                            <span className="flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              Rumah
                            </span>
                          )}
                          {customer.loan === "yes" && (
                            <span className="flex items-center gap-1">
                              <Wallet className="w-3 h-3" />
                              Pinjaman
                            </span>
                          )}
                          {customer.has_default === "yes" && (
                            <span className="flex items-center gap-1 text-red-600">
                              <TrendingUp className="w-3 h-3" />
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/customers/${customer.id}`);
                        }}
                        className="gap-1 text-xs sm:text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                        data-testid={`detail-customer-btn-${customer.id}`}
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Detail</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(customer);
                        }}
                        className="gap-1 text-xs sm:text-sm"
                        data-testid={`edit-customer-btn-${customer.id}`}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(customer);
                        }}
                        className="gap-1 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`delete-customer-btn-${customer.id}`}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Hapus</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          data-testid="edit-customer-dialog"
          className="max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Ubah informasi customer {selectedCustomer?.name}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEditCustomer}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap *</Label>
                <Input
                  id="edit-name"
                  placeholder="Contoh: Budi Santoso"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-age">Umur *</Label>
                <Input
                  id="edit-age"
                  type="number"
                  placeholder="35"
                  value={editForm.age}
                  onChange={(e) =>
                    setEditForm({ ...editForm, age: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-job">Pekerjaan</Label>
                <Select
                  value={editForm.job}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, job: value })
                  }
                >
                  <SelectTrigger id="edit-job">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="blue-collar">Blue Collar</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-marital">Status Perkawinan</Label>
                <Select
                  value={editForm.marital}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, marital: value })
                  }
                >
                  <SelectTrigger id="edit-marital">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-education">Pendidikan</Label>
                <Select
                  value={editForm.education}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, education: value })
                  }
                >
                  <SelectTrigger id="edit-education">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="illiterate">Illiterate</SelectItem>
                    <SelectItem value="basic.4y">Basic (4 years)</SelectItem>
                    <SelectItem value="basic.6y">Basic (6 years)</SelectItem>
                    <SelectItem value="basic.9y">Basic (9 years)</SelectItem>
                    <SelectItem value="high.school">High School</SelectItem>
                    <SelectItem value="professional.course">
                      Professional Course
                    </SelectItem>
                    <SelectItem value="university.degree">
                      University Degree
                    </SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-balance">Saldo *</Label>
                <Input
                  id="edit-balance"
                  type="number"
                  placeholder="1200.50"
                  value={editForm.balance}
                  onChange={(e) =>
                    setEditForm({ ...editForm, balance: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-default">Default</Label>
                <Select
                  value={editForm.has_default}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, has_default: value })
                  }
                >
                  <SelectTrigger id="edit-default">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Ya</SelectItem>
                    <SelectItem value="no">Tidak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-housing">Rumah</Label>
                <Select
                  value={editForm.housing}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, housing: value })
                  }
                >
                  <SelectTrigger id="edit-housing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Ya</SelectItem>
                    <SelectItem value="no">Tidak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-loan">Pinjaman</Label>
                <Select
                  value={editForm.loan}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, loan: value })
                  }
                >
                  <SelectTrigger id="edit-loan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Ya</SelectItem>
                    <SelectItem value="no">Tidak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="delete-confirmation-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus customer{" "}
              <span className="font-semibold text-gray-900">
                {selectedCustomer?.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan dan semua leads terkait akan
              dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerManagementPage;
