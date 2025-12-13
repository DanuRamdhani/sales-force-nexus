import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch, clearSession } from "../lib/auth";
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
import { toast } from "sonner";
import {
  ArrowLeft,
  Flame,
  Wind,
  Snowflake,
  Phone,
  Calendar,
  Edit,
  Trash2,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const LeadManagementPage = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();

  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState(null);
  const [latestScore, setLatestScore] = useState(null);
  const [followups, setFollowups] = useState([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    contact_type: "cellular",
    last_contact_date: "",
    campaign: "1",
    previous_contacts: "0",
    prev_outcome: "nonexistent",
    status: "new",
  });

  const [scoreForm, setScoreForm] = useState({
    score: "0.5",
    bucket: "warm",
    explanation: "",
  });

  useEffect(() => {
    fetchLeadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  const fetchLeadDetail = async () => {
    try {
      const response = await authFetch(`/api/admin/leads/${leadId}`, {
        method: "GET",
      });
      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
        } else if (response.status === 404) {
          toast.error("Lead tidak ditemukan");
          navigate("/admin/customers", { replace: true });
        }
        throw new Error("Gagal memuat detail lead");
      }
      const data = await response.json();
      setLead(data.lead);
      setLatestScore(data.latestScore || null);
      setFollowups(data.followups || []);
      setEditForm((prev) => ({
        ...prev,
        contact_type: data.lead?.contact_type || "cellular",
        last_contact_date: data.lead?.last_contact_date || "",
        campaign: String(data.lead?.campaign ?? "1"),
        previous_contacts: String(data.lead?.previous_contacts ?? "0"),
        prev_outcome: data.lead?.prev_outcome || "nonexistent",
        status: data.lead?.status || "new",
      }));
    } catch (error) {
      toast.error(error.message || "Gagal memuat detail lead");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    try {
      const response = await authFetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_type: editForm.contact_type,
          last_contact_date: editForm.last_contact_date,
          campaign: parseInt(editForm.campaign),
          previous_contacts: parseInt(editForm.previous_contacts),
          prev_outcome: editForm.prev_outcome,
          status: editForm.status,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Gagal memperbarui lead");
      toast.success(data.message || "Lead berhasil diperbarui");
      setEditDialogOpen(false);
      await fetchLeadDetail();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteLead = async () => {
    try {
      const response = await authFetch(`/api/admin/leads/${leadId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal menghapus lead");
      toast.success(data.message || "Lead berhasil dihapus");
      navigate(`/admin/customers/${lead?.customer_id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleCreateScore = async (e) => {
    e.preventDefault();
    try {
      const response = await authFetch(`/api/admin/leads/${leadId}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: parseFloat(scoreForm.score),
          bucket: scoreForm.bucket,
          explanation: scoreForm.explanation,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal membuat score");
      toast.success(data.message || "Score berhasil ditambahkan");
      setScoreDialogOpen(false);
      setScoreForm({ score: "0.5", bucket: "warm", explanation: "" });
      await fetchLeadDetail();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const bucketColor = (bucket) => {
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

  const bucketIcon = (bucket) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-top-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat detail lead...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Lead tidak ditemukan</p>
            <Button
              onClick={() => navigate("/admin/customers")}
              className="mt-4"
            >
              Kembali ke Daftar Customer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" data-testid="lead-management-page">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate(`/admin/customers/${lead.customer_id}`)}
              className="gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>

            <div className="flex items-center gap-2">
              <Dialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="gap-1 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!!latestScore}
                    title={
                      latestScore
                        ? "Score sudah ada. Tidak dapat menambah lagi."
                        : undefined
                    }
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      Tambah Score (Manual)
                    </span>
                    <span className="sm:hidden">Score</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tambahkan Score Lead</DialogTitle>
                    <DialogDescription>
                      Gunakan ini sementara sebelum ML API siap.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleCreateScore}>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="score">Score (0 - 1)</Label>
                        <Input
                          id="score"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={scoreForm.score}
                          onChange={(e) =>
                            setScoreForm({
                              ...scoreForm,
                              score: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bucket">Bucket</Label>
                        <select
                          id="bucket"
                          className="border rounded px-3 py-2 w-full"
                          value={scoreForm.bucket}
                          onChange={(e) =>
                            setScoreForm({
                              ...scoreForm,
                              bucket: e.target.value,
                            })
                          }
                        >
                          <option value="hot">Hot</option>
                          <option value="warm">Warm</option>
                          <option value="cold">Cold</option>
                        </select>
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="explanation">Penjelasan</Label>
                        <Input
                          id="explanation"
                          placeholder="Contoh: High balance, previous success"
                          value={scoreForm.explanation}
                          onChange={(e) =>
                            setScoreForm({
                              ...scoreForm,
                              explanation: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      Simpan Score
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-1 sm:gap-2">
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit Lead</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Lead</DialogTitle>
                    <DialogDescription>
                      Perbarui informasi lead.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleUpdateLead}>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="contact-type">Tipe Kontak</Label>
                        <select
                          id="contact-type"
                          className="border rounded px-3 py-2 w-full"
                          value={editForm.contact_type}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              contact_type: e.target.value,
                            })
                          }
                        >
                          <option value="cellular">Cellular</option>
                          <option value="telephone">Telephone</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last-contact">Tanggal Kontak *</Label>
                        <Input
                          id="last-contact"
                          type="date"
                          value={editForm.last_contact_date}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
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
                          value={editForm.campaign}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              campaign: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prev-contacts">Kontak Sebelumnya</Label>
                        <Input
                          id="prev-contacts"
                          type="number"
                          placeholder="0"
                          value={editForm.previous_contacts}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              previous_contacts: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prev-outcome">Hasil Sebelumnya</Label>
                        <select
                          id="prev-outcome"
                          className="border rounded px-3 py-2 w-full"
                          value={editForm.prev_outcome}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              prev_outcome: e.target.value,
                            })
                          }
                        >
                          <option value="nonexistent">Nonexistent</option>
                          <option value="success">Success</option>
                          <option value="failure">Failure</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          className="border rounded px-3 py-2 w-full"
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="closed_won">Closed Won</option>
                          <option value="closed_lost">Closed Lost</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      Simpan Perubahan
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-1 sm:gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Hapus Lead</span>
                    <span className="sm:hidden">Hapus</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hapus Lead?</DialogTitle>
                    <DialogDescription>
                      Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDeleteLead}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Hapus
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Lead Summary */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl heading-font">
              Lead #{lead.id}
            </CardTitle>
            <CardDescription>
              Nasabah: {lead.customer_name} (ID: {lead.customer_id})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border">
                <p className="text-xs text-gray-500 mb-1">Tipe Kontak</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Phone className="w-4 h-4" />
                  <span className="capitalize">{lead.contact_type}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border">
                <p className="text-xs text-gray-500 mb-1">Tanggal Kontak</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {lead.last_contact_date
                      ? format(
                          new Date(lead.last_contact_date),
                          "dd MMM yyyy",
                          { locale: id }
                        )
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border">
                <p className="text-xs text-gray-500 mb-1">Campaign</p>
                <div className="text-gray-900">{lead.campaign}</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border">
                <p className="text-xs text-gray-500 mb-1">Kontak Sebelumnya</p>
                <div className="text-gray-900">
                  {lead.previous_contacts ?? 0} kali
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border">
                <p className="text-xs text-gray-500 mb-1">Hasil Sebelumnya</p>
                <div className="text-gray-900 capitalize">
                  {lead.prev_outcome ?? "unknown"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className="text-gray-900 capitalize">{lead.status}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Score */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl heading-font">
              Skor Terbaru
            </CardTitle>
            <CardDescription>Skor terakhir dari ML atau manual</CardDescription>
          </CardHeader>
          <CardContent>
            {latestScore ? (
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-xl bg-gradient-to-br ${bucketColor(
                    latestScore.bucket
                  )} flex flex-col items-center justify-center`}
                >
                  {bucketIcon(latestScore.bucket)}
                  <span className="text-white text-sm font-bold">
                    {(latestScore.score * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Bucket:{" "}
                    <span className="font-semibold capitalize">
                      {latestScore.bucket}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Penjelasan:{" "}
                    <span className="font-semibold">
                      {latestScore.explanation}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Dibuat:{" "}
                    {format(
                      new Date(latestScore.created_at),
                      "dd MMM yyyy HH:mm",
                      { locale: id }
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Belum ada score.</p>
            )}
          </CardContent>
        </Card>

        {/* Followups */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-bold heading-font mb-1">
              Follow-ups ({followups.length})
            </h2>
            <p className="text-sm text-gray-600">
              Riwayat tindak lanjut oleh sales
            </p>
          </div>

          {followups.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-600">Belum ada follow-up</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {followups.map((fu) => (
                <Card key={fu.id} className="animate-fadeIn">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Follow-up #{fu.id}
                          </h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {fu.result}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{fu.notes}</p>
                        {fu.next_action_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Next:{" "}
                            {format(
                              new Date(fu.next_action_at),
                              "dd MMM yyyy HH:mm",
                              { locale: id }
                            )}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>
                          Dibuat:{" "}
                          {format(
                            new Date(fu.created_at),
                            "dd MMM yyyy HH:mm",
                            { locale: id }
                          )}
                        </p>
                        <p>
                          Oleh: {fu.user_name} ({fu.user_email})
                        </p>
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

export default LeadManagementPage;
