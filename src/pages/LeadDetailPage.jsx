import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
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
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Heart,
  Wallet,
  Home,
  CreditCard,
  Phone,
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Flame,
  Wind,
  Snowflake,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { authFetch, clearSession } from "../lib/auth";

const LeadDetailPage = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const [loading, setLoading] = useState(true);
  const [leadData, setLeadData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingFollowupId, setEditingFollowupId] = useState(null);
  const [followupForm, setFollowupForm] = useState({
    result: "",
    notes: "",
    next_action_at: "",
  });

  useEffect(() => {
    if (leadId) {
      fetchLeadDetail();
    }
  }, [leadId]);

  const fetchLeadDetail = async () => {
    try {
      const response = await authFetch(`/api/sales/leads/${leadId}`, {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
        } else if (response.status === 404) {
          toast.error("Lead tidak ditemukan");
          navigate("/", { replace: true });
        }
        throw new Error("Gagal memuat detail lead");
      }

      const data = await response.json();

      // Transform API response to component structure
      const transformed = {
        lead: {
          contact_type: data.lead.contact_type,
          last_contact_date: data.lead.last_contact_date,
          campaign: data.lead.campaign,
          previous_contacts: data.lead.previous_contacts,
          status: data.lead.status,
        },
        customer: {
          name: data.lead.customer_name,
          age: data.lead.age,
          job: data.lead.job,
          education: data.lead.education,
          marital: data.lead.marital,
          balance: parseFloat(data.lead.balance),
          housing: data.lead.housing,
          loan: data.lead.loan,
          has_default: data.lead.has_default,
          contact: data.lead.contact,
        },
        score: {
          score: parseFloat(data.latestScore.score),
          bucket: data.latestScore.bucket,
          explanation: data.latestScore.explanation,
        },
        followups: data.followups || [],
      };

      setLeadData(transformed);
    } catch (error) {
      toast.error(error.message || "Gagal memuat detail lead");
    } finally {
      setLoading(false);
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

  const getResultIcon = (result) => {
    switch (result) {
      case "berhasil":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "menolak":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "sibuk":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "followup_lagi":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getResultLabel = (result) => {
    const labels = {
      berhasil: "Berhasil",
      menolak: "Menolak",
      sibuk: "Sibuk",
      followup_lagi: "Follow Up Lagi",
    };
    return labels[result] || result;
  };

  const resetFollowupForm = () => {
    setFollowupForm({ result: "", notes: "", next_action_at: "" });
    setEditingFollowupId(null);
  };

  const handleSubmitFollowup = async (e) => {
    e.preventDefault();

    if (!followupForm.result) {
      toast.error("Hasil follow-up harus dipilih");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        result: followupForm.result,
        notes: followupForm.notes,
      };

      // Add next_action_at only if result is followup_lagi and date is provided
      if (
        followupForm.result === "followup_lagi" &&
        followupForm.next_action_at
      ) {
        payload.next_action_at = followupForm.next_action_at;
      }

      const url = editingFollowupId
        ? `/api/sales/leads/${leadId}/followups/${editingFollowupId}`
        : `/api/sales/leads/${leadId}/followups`;

      const method = editingFollowupId ? "PUT" : "POST";

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          editingFollowupId
            ? "Gagal mengubah follow-up"
            : "Gagal menambahkan follow-up"
        );
      }

      toast.success(
        editingFollowupId
          ? "Follow-up berhasil diperbarui"
          : "Follow-up berhasil ditambahkan"
      );
      setDialogOpen(false);
      resetFollowupForm();

      // Refresh lead data to get updated followups
      await fetchLeadDetail();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFollowup = (followup) => {
    setFollowupForm({
      result: followup.result,
      notes: followup.notes || "",
      next_action_at: followup.next_action_at || "",
    });
    setEditingFollowupId(followup.id);
    setDialogOpen(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    setSubmitting(true);
    try {
      const response = await authFetch(`/api/sales/leads/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengubah status lead");
      }

      toast.success("Status lead berhasil diperbarui");

      // Update local state
      setLeadData((prev) => ({
        ...prev,
        lead: {
          ...prev.lead,
          status: newStatus,
        },
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Memuat detail lead...</p>
        </div>
      </div>
    );
  }

  if (!leadData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Lead tidak ditemukan</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { lead, customer, score, followups } = leadData;

  return (
    <div className="min-h-screen pb-12" data-testid="lead-detail-page">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetFollowupForm();
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2 btn-scale"
                  data-testid="add-followup-button"
                  onClick={() => resetFollowupForm()}
                >
                  <Plus className="w-4 h-4" />
                  Tambah Follow-up
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="followup-dialog">
                <DialogHeader>
                  <DialogTitle>
                    {editingFollowupId ? "Edit Follow-up" : "Tambah Follow-up"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingFollowupId
                      ? "Ubah hasil interaksi dengan nasabah"
                      : "Catat hasil interaksi dengan nasabah"}
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmitFollowup}>
                  <div className="space-y-2">
                    <Label htmlFor="result">Hasil Follow-up *</Label>
                    <Select
                      value={followupForm.result}
                      onValueChange={(value) =>
                        setFollowupForm({ ...followupForm, result: value })
                      }
                      required
                    >
                      <SelectTrigger
                        id="result"
                        data-testid="followup-result-select"
                      >
                        <SelectValue placeholder="Pilih hasil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="berhasil">Berhasil</SelectItem>
                        <SelectItem value="menolak">Menolak</SelectItem>
                        <SelectItem value="sibuk">Sibuk</SelectItem>
                        <SelectItem value="followup_lagi">
                          Follow Up Lagi
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Catatan</Label>
                    <Textarea
                      id="notes"
                      data-testid="followup-notes-input"
                      placeholder="Tulis catatan hasil percakapan..."
                      value={followupForm.notes}
                      onChange={(e) =>
                        setFollowupForm({
                          ...followupForm,
                          notes: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>

                  {followupForm.result === "followup_lagi" && (
                    <div className="space-y-2">
                      <Label htmlFor="next_action">
                        Jadwal Follow-up Berikutnya
                      </Label>
                      <Input
                        id="next_action"
                        data-testid="followup-next-action-input"
                        type="datetime-local"
                        value={followupForm.next_action_at}
                        onChange={(e) =>
                          setFollowupForm({
                            ...followupForm,
                            next_action_at: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    data-testid="submit-followup-button"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={submitting}
                  >
                    {submitting
                      ? editingFollowupId
                        ? "Memperbarui..."
                        : "Menyimpan..."
                      : editingFollowupId
                      ? "Perbarui Follow-up"
                      : "Simpan Follow-up"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info & Score */}
          <div className="lg:col-span-1 space-y-6">
            {/* Score Card */}
            <Card
              className={`border-0 bg-gradient-to-br ${getBucketColor(
                score.bucket
              )} text-white shadow-xl`}
              data-testid="score-card"
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {getBucketIcon(score.bucket)}
                </div>
                <h3 className="text-6xl font-bold heading-font mb-2">
                  {(score.score * 100).toFixed(0)}%
                </h3>
                <p className="text-lg font-semibold uppercase tracking-wider mb-3">
                  {score.bucket} Lead
                </p>
                <p className="text-sm opacity-90">{score.explanation}</p>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card data-testid="customer-info-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 heading-font">
                  <User className="w-5 h-5" />
                  Informasi Nasabah
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {customer.name}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Usia</p>
                      <p className="font-medium">{customer.age} tahun</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pekerjaan</p>
                      <p className="font-medium capitalize">
                        {customer.job.replace(".", "")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pendidikan</p>
                      <p className="font-medium capitalize">
                        {customer.education}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status Pernikahan</p>
                      <p className="font-medium capitalize">
                        {customer.marital}
                      </p>
                    </div>
                  </div>

                  {customer.contact && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Kontak</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{customer.contact}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`tel:${customer.contact}`, '_self')}
                            className="h-6 px-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                            title="Panggil customer"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Panggil
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Info */}
            <Card data-testid="financial-info-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 heading-font">
                  <Wallet className="w-5 h-5" />
                  Informasi Finansial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Saldo</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(customer.balance)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Pinjaman Rumah
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${
                      customer.housing === "yes"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {customer.housing === "yes" ? "Ya" : "Tidak"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Pinjaman Personal
                    </span>
                  </div>
                  <span
                    className={`font-semibold ${
                      customer.loan === "yes"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {customer.loan === "yes" ? "Ya" : "Tidak"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Default</span>
                  <span
                    className={`font-semibold ${
                      customer.has_default === "yes"
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {customer.has_default === "yes" ? "Ya" : "Tidak"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Lead Info & Followups */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lead Info */}
            <Card data-testid="lead-info-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 heading-font">
                  <Target className="w-5 h-5" />
                  Informasi Lead
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tipe Kontak</p>
                      <p className="font-medium capitalize">
                        {lead.contact_type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kontak Terakhir</p>
                      <p className="font-medium">
                        {format(
                          new Date(lead.last_contact_date),
                          "dd MMM yyyy",
                          { locale: id }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Campaign</p>
                      <p className="font-medium">Campaign #{lead.campaign}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kontak Sebelumnya</p>
                      <p className="font-medium">{lead.previous_contacts}x</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">Status Lead</p>
                  <div className="flex flex-col gap-3">
                    <span
                      className={`status-${lead.status.replace(
                        "_",
                        "-"
                      )} inline-flex items-center gap-2 w-fit`}
                    >
                      {lead.status === "closed_won" && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {lead.status === "closed_lost" && (
                        <XCircle className="w-4 h-4" />
                      )}
                      {lead.status === "in_progress" && (
                        <Clock className="w-4 h-4" />
                      )}
                      {lead.status === "new" && <Target className="w-4 h-4" />}
                      {lead.status.replace("_", " ").toUpperCase()}
                    </span>

                    {/* Status Update Buttons */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {lead.status !== "new" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus("new")}
                          disabled={submitting || lead.status === "new"}
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Reset to New
                        </Button>
                      )}
                      {lead.status !== "in_progress" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus("in_progress")}
                          disabled={submitting || lead.status === "in_progress"}
                          className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          In Progress
                        </Button>
                      )}
                      {lead.status !== "closed_won" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus("closed_won")}
                          disabled={submitting || lead.status === "closed_won"}
                          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Closed Won
                        </Button>
                      )}
                      {lead.status !== "closed_lost" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus("closed_lost")}
                          disabled={submitting || lead.status === "closed_lost"}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-700"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Closed Lost
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Followups Timeline */}
            <Card data-testid="followups-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 heading-font">
                  <MessageSquare className="w-5 h-5" />
                  Riwayat Follow-up
                  <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                    {followups.length}
                  </span>
                </CardTitle>
                <CardDescription>
                  Catatan interaksi dengan nasabah
                </CardDescription>
              </CardHeader>
              <CardContent>
                {followups.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Belum ada follow-up</p>
                    <Button
                      onClick={() => setDialogOpen(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Follow-up Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {followups.map((followup, index) => (
                      <div
                        key={followup.id}
                        className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0 last:pb-0 animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        data-testid={`followup-item-${followup.id}`}
                      >
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getResultIcon(followup.result)}
                              <span className="font-semibold text-gray-900">
                                {getResultLabel(followup.result)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {format(
                                  new Date(followup.created_at),
                                  "dd MMM yyyy, HH:mm",
                                  { locale: id }
                                )}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditFollowup(followup)}
                                className="h-6 w-6 p-0"
                                data-testid={`edit-followup-btn-${followup.id}`}
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </Button>
                            </div>
                          </div>

                          {followup.notes && (
                            <p className="text-sm text-gray-700 mb-3">
                              {followup.notes}
                            </p>
                          )}

                          {followup.next_action_at && (
                            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
                              <Clock className="w-3 h-3" />
                              <span>
                                Next:{" "}
                                {format(
                                  new Date(followup.next_action_at),
                                  "dd MMM yyyy, HH:mm",
                                  { locale: id }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadDetailPage;
