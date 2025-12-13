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
  Trash2,
  Key,
  Mail,
  User,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { authFetch, clearSession } from "../lib/auth";

const SalesManagementPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [salesUsers, setSalesUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSales, setSelectedSales] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    is_active: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSalesUsers();
  }, []);

  const fetchSalesUsers = async () => {
    try {
      const response = await authFetch("/api/admin/users/sales", {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memuat daftar sales");
      }

      const data = await response.json();
      setSalesUsers(data.data || []);
    } catch (error) {
      toast.error(error.message || "Gagal memuat daftar sales");
    } finally {
      setLoading(false);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({ name: "", email: "", password: "" });
  };

  const resetEditForm = () => {
    setEditForm({ name: "", email: "", is_active: true });
    setSelectedSales(null);
  };

  const resetPasswordForm = () => {
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setSelectedSales(null);
  };

  const handleCreateSales = async (e) => {
    e.preventDefault();

    if (!createForm.name || !createForm.email || !createForm.password) {
      toast.error("Semua field harus diisi");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.email)) {
      toast.error("Format email tidak valid");
      return;
    }

    if (createForm.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authFetch("/api/admin/users/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat sales user");
      }

      toast.success(data.message || "Sales user berhasil dibuat");
      setDialogOpen(false);
      resetCreateForm();
      await fetchSalesUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSales = async (e) => {
    e.preventDefault();

    if (!editForm.name || !editForm.email) {
      toast.error("Nama dan email harus diisi");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      toast.error("Format email tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authFetch(
        `/api/admin/users/sales/${selectedSales.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editForm.name,
            email: editForm.email,
            is_active: editForm.is_active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah data sales");
      }

      toast.success(data.message || "Data sales berhasil diperbarui");
      setEditDialogOpen(false);
      resetEditForm();
      await fetchSalesUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Semua field harus diisi");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authFetch(
        `/api/admin/users/${selectedSales.id}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword: passwordForm.newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mereset password");
      }

      toast.success(data.message || "Password berhasil direset");
      setPasswordDialogOpen(false);
      resetPasswordForm();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSales = async () => {
    setSubmitting(true);
    try {
      const response = await authFetch(
        `/api/admin/users/sales/${selectedSales.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus sales user");
      }

      toast.success(data.message || "Sales user berhasil dihapus");
      setDeleteDialogOpen(false);
      setSelectedSales(null);
      await fetchSalesUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (sales) => {
    setSelectedSales(sales);
    setEditForm({
      name: sales.name,
      email: sales.email,
      is_active: sales.is_active === 1 || sales.is_active === true,
    });
    setEditDialogOpen(true);
  };

  const handleToggleStatus = async (sales) => {
    const newStatus = !sales.is_active;
    setSubmitting(true);
    try {
      const response = await authFetch(`/api/admin/users/sales/${sales.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sales.name,
          email: sales.email,
          is_active: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah status sales");
      }

      toast.success(
        data.message ||
          `Sales ${newStatus ? "diaktifkan" : "dinonaktifkan"} berhasil`
      );
      await fetchSalesUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openPasswordDialog = (sales) => {
    setSelectedSales(sales);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setPasswordDialogOpen(true);
  };

  const openDeleteDialog = (sales) => {
    setSelectedSales(sales);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat data sales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" data-testid="sales-management-page">
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
                  data-testid="add-sales-button"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Sales</span>
                  <span className="sm:hidden">Tambah</span>
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="create-sales-dialog">
                <DialogHeader>
                  <DialogTitle>Tambah Sales User Baru</DialogTitle>
                  <DialogDescription>
                    Buat akun sales user baru untuk sistem
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateSales}>
                  <div className="space-y-2">
                    <Label htmlFor="create-name">Nama Lengkap *</Label>
                    <Input
                      id="create-name"
                      placeholder="Contoh: John Doe"
                      value={createForm.name}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-email">Email *</Label>
                    <Input
                      id="create-email"
                      type="email"
                      placeholder="sales@bank.co.id"
                      value={createForm.email}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-password">Password *</Label>
                    <Input
                      id="create-password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={createForm.password}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={submitting}
                  >
                    {submitting ? "Membuat..." : "Buat Sales User"}
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
            Manajemen Sales
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Kelola akun sales user dan hak akses mereka
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-4 sm:mb-6 border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              Total Sales User
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold heading-font text-gray-900">
              {salesUsers.length}
            </p>
          </CardContent>
        </Card>

        {/* Sales List */}
        <div className="space-y-3">
          {salesUsers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Belum ada sales user</p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Sales Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            salesUsers.map((sales, index) => (
              <Card
                key={sales.id}
                className="card-hover animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`sales-card-${sales.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {sales.name}
                          </h3>
                          {sales.is_active ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{sales.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Dibuat:{" "}
                            {format(new Date(sales.created_at), "dd MMM yyyy", {
                              locale: id,
                            })}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Status: {sales.is_active ? "Aktif" : "Nonaktif"}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(sales)}
                        className={`gap-1 text-xs sm:text-sm ${
                          sales.is_active
                            ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        }`}
                        data-testid={`toggle-status-btn-${sales.id}`}
                        disabled={submitting}
                      >
                        {sales.is_active ? (
                          <>
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">
                              Nonaktifkan
                            </span>
                            <span className="sm:hidden">Off</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Aktifkan</span>
                            <span className="sm:hidden">On</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(sales)}
                        className="gap-1 text-xs sm:text-sm"
                        data-testid={`edit-sales-btn-${sales.id}`}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPasswordDialog(sales)}
                        className="gap-1 text-xs sm:text-sm"
                        data-testid={`reset-password-btn-${sales.id}`}
                      >
                        <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Reset</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(sales)}
                        className="gap-1 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`delete-sales-btn-${sales.id}`}
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
        <DialogContent data-testid="edit-sales-dialog">
          <DialogHeader>
            <DialogTitle>Edit Sales User</DialogTitle>
            <DialogDescription>
              Ubah informasi sales user {selectedSales?.name}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEditSales}>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Lengkap *</Label>
              <Input
                id="edit-name"
                placeholder="Contoh: John Doe"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="sales@bank.co.id"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                required
              />
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

      {/* Reset Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent data-testid="reset-password-dialog">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password untuk {selectedSales?.name}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div className="space-y-2">
              <Label htmlFor="new-password">Password Baru *</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Konfirmasi Password *</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Ketik ulang password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              disabled={submitting}
            >
              {submitting ? "Mereset..." : "Reset Password"}
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
              Apakah Anda yakin ingin menghapus sales user{" "}
              <span className="font-semibold text-gray-900">
                {selectedSales?.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan
              dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSales}
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

export default SalesManagementPage;
