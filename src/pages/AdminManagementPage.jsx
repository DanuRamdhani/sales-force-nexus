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
  Plus,
  Edit,
  Trash2,
  Users,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { authFetch, clearSession } from "../lib/auth";

const AdminManagementPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await authFetch("/api/super-admin/users/admin", {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
          return;
        }
        throw new Error("Gagal memuat daftar admin");
      }

      const data = await response.json();
      setAdmins(data.data || []);
    } catch (error) {
      toast.error(error.message || "Gagal memuat daftar admin");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Semua field harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authFetch("/api/super-admin/users/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat admin");
      }

      toast.success(data.message || "Admin berhasil dibuat");
      setDialogOpen(false);
      setForm({ name: "", email: "", password: "" });
      await fetchAdmins();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      name: admin.name,
      email: admin.email,
      password: "",
    });
    setEditDialogOpen(true);
  };

  const handleEditAdmin = async (e) => {
    e.preventDefault();

    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error("Nama dan email harus diisi");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        name: editForm.name,
        email: editForm.email,
      };

      // Only include password if it's provided
      if (editForm.password.trim()) {
        body.password = editForm.password;
      }

      const response = await authFetch(
        `/api/super-admin/users/admin/${selectedAdmin.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui admin");
      }

      toast.success(data.message || "Admin berhasil diperbarui");
      setEditDialogOpen(false);
      setSelectedAdmin(null);
      await fetchAdmins();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (admin) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteAdmin = async () => {
    setSubmitting(true);
    try {
      const response = await authFetch(
        `/api/super-admin/users/admin/${selectedAdmin.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus admin");
      }

      toast.success(data.message || "Admin berhasil dihapus");
      setDeleteDialogOpen(false);
      setSelectedAdmin(null);
      await fetchAdmins();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAdminStatus = async (admin) => {
    setSubmitting(true);
    try {
      const body = {
        name: admin.name,
        email: admin.email,
        is_active: admin.is_active === 1 ? 0 : 1,
      };

      const response = await authFetch(
        `/api/super-admin/users/admin/${admin.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah status admin");
      }

      toast.success(
        data.message ||
          (admin.is_active ? "Admin dinonaktifkan" : "Admin diaktifkan")
      );
      await fetchAdmins();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen pb-12" data-testid="admin-management-page">
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-1 sm:gap-2 btn-scale text-sm sm:text-base"
                  data-testid="add-admin-button"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Admin</span>
                  <span className="sm:hidden">Tambah</span>
                </Button>
              </DialogTrigger>
              <DialogContent
                data-testid="create-admin-dialog"
                className="max-h-[90vh] overflow-y-auto"
              >
                <DialogHeader>
                  <DialogTitle>Tambah Admin Baru</DialogTitle>
                  <DialogDescription>
                    Buat akun admin baru untuk sistem
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateAdmin}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      placeholder="Contoh: Admin Baru"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@bank.co.id"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={submitting}
                  >
                    {submitting ? "Membuat..." : "Buat Admin"}
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
            Manajemen Admin
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Kelola akun admin dan hak akses mereka
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-4 sm:mb-6 border-l-4 border-l-purple-500">
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              Total Admin User
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold heading-font text-gray-900">
              {filteredAdmins.length}
            </p>
          </CardContent>
        </Card>

        {/* Admin List */}
        <div className="space-y-3">
          {filteredAdmins.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Belum ada admin</p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Admin Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredAdmins.map((admin, index) => (
                <Card
                  key={admin.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  data-testid={`admin-card-${admin.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                        </div>

                        {/* Admin Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mb-1">
                              {admin.name}
                            </h3>
                            {admin.is_active ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {admin.email}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(
                                new Date(admin.created_at),
                                "dd MMM yyyy",
                                { locale: id }
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Status: {admin.is_active ? "Aktif" : "Nonaktif"}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAdminStatus(admin)}
                          className={`gap-1 text-xs sm:text-sm ${
                            admin.is_active
                              ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          }`}
                          disabled={submitting}
                          data-testid={`toggle-admin-btn-${admin.id}`}
                        >
                          {admin.is_active ? (
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
                        <Dialog
                          open={
                            editDialogOpen && selectedAdmin?.id === admin.id
                          }
                          onOpenChange={setEditDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(admin)}
                              className="gap-1 text-xs sm:text-sm"
                              data-testid={`edit-admin-btn-${admin.id}`}
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            data-testid="edit-admin-dialog"
                            className="max-h-[90vh] overflow-y-auto"
                          >
                            <DialogHeader>
                              <DialogTitle>Edit Admin</DialogTitle>
                              <DialogDescription>
                                Ubah informasi admin {selectedAdmin?.name}
                              </DialogDescription>
                            </DialogHeader>
                            <form
                              className="space-y-4"
                              onSubmit={handleEditAdmin}
                            >
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">
                                  Nama Lengkap *
                                </Label>
                                <Input
                                  id="edit-name"
                                  placeholder="Contoh: Admin Baru"
                                  value={editForm.name}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="edit-email">Email *</Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  placeholder="admin@bank.co.id"
                                  value={editForm.email}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      email: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="edit-password">
                                  Password (Kosongkan jika tidak ingin mengubah)
                                </Label>
                                <Input
                                  id="edit-password"
                                  type="password"
                                  placeholder="••••••••"
                                  value={editForm.password}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      password: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                disabled={submitting}
                              >
                                {submitting
                                  ? "Menyimpan..."
                                  : "Simpan Perubahan"}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog
                          open={
                            deleteDialogOpen && selectedAdmin?.id === admin.id
                          }
                          onOpenChange={setDeleteDialogOpen}
                        >
                          <AlertDialog
                            open={
                              deleteDialogOpen && selectedAdmin?.id === admin.id
                            }
                            onOpenChange={setDeleteDialogOpen}
                          >
                            <div
                              onClick={() => openDeleteDialog(admin)}
                              className="contents"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  openDeleteDialog(admin);
                                  setDeleteDialogOpen(true);
                                }}
                                className="gap-1 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                                data-testid={`delete-admin-btn-${admin.id}`}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Hapus</span>
                              </Button>
                            </div>
                          </AlertDialog>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Admin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Anda akan menghapus admin {selectedAdmin?.name}.
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteAdmin}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={submitting}
                              >
                                {submitting ? "Menghapus..." : "Hapus"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Dialog - Standalone */}
      <Dialog
        open={editDialogOpen && !deleteDialogOpen}
        onOpenChange={setEditDialogOpen}
      >
        <DialogContent
          data-testid="edit-admin-dialog-standalone"
          className="max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Ubah informasi admin {selectedAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEditAdmin}>
            <div className="space-y-2">
              <Label htmlFor="edit-name-standalone">Nama Lengkap *</Label>
              <Input
                id="edit-name-standalone"
                placeholder="Contoh: Admin Baru"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email-standalone">Email *</Label>
              <Input
                id="edit-email-standalone"
                type="email"
                placeholder="admin@bank.co.id"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password-standalone">
                Password (Kosongkan jika tidak ingin mengubah)
              </Label>
              <Input
                id="edit-password-standalone"
                type="password"
                placeholder="••••••••"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    password: e.target.value,
                  })
                }
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

      {/* Delete Dialog - Standalone */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus admin {selectedAdmin?.name}. Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              className="bg-red-600 hover:bg-red-700"
              disabled={submitting}
            >
              {submitting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManagementPage;
