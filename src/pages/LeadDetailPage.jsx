import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft, User, Briefcase, GraduationCap, Heart,
  Wallet, Home, CreditCard, Phone, Calendar, Target,
  TrendingUp, MessageSquare, CheckCircle, XCircle,
  Clock, Plus, Flame, Wind, Snowflake
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const LeadDetailPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, ] = useState(false);
  const [followupForm, setFollowupForm] = useState({
    result: "",
    notes: "",
    next_action_at: ""
  });

  useEffect(() => {
    fetchLeadDetail();
  });

  const fetchLeadDetail = async () => {
    try {
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      toast.error("Gagal memuat detail lead");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const score = {
    score: 0.85,
    bucket: "warm",
    explanation: "Lead ini menunjukkan minat yang baik tetapi membutuhkan lebih banyak interaksi."
  };
  
  const customer = {
    name: "Andi Wijaya",
    age:  32,
    job: "teknisi",
    education: "sarjana",
    marital: "menikah",
    balance: 1500000,
    housing: "yes",
    loan: "no",
    has_default: "no"
  };

  const lead = {
    contact_type: "telepon",
    last_contact_date: "2024-06-15",
    campaign: 3,
    previous_contacts: 2,
    status: "in_progress"
  };

  const followups = [
    {
      id: 1,
      result: "sibuk",
      notes: "Nasabah sibuk saat dihubungi, akan dihubungi kembali minggu depan.",
      created_at: "2024-06-10T10:30:00Z",
      next_action_at: "2024-06-17T14:00:00Z"
    },
    {
      id: 2,
      result: "berhasil",
      notes: "Nasabah setuju untuk melanjutkan proses pengajuan pinjaman.",
      created_at: "2024-06-12T15:45:00Z",
      next_action_at: "2024-06-19T10:00:00Z"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getBucketColor = (bucket) => {
    switch (bucket) {
      case "hot": return "from-red-500 to-red-600";
      case "warm": return "from-amber-500 to-amber-600";
      case "cold": return "from-blue-500 to-blue-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getBucketIcon = (bucket) => {
    switch (bucket) {
      case "hot": return <Flame className="w-6 h-6" />;
      case "warm": return <Wind className="w-6 h-6" />;
      case "cold": return <Snowflake className="w-6 h-6" />;
      default: return null;
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case "berhasil": return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "menolak": return <XCircle className="w-5 h-5 text-red-600" />;
      case "sibuk": return <Clock className="w-5 h-5 text-amber-600" />;
      case "followup_lagi": return <MessageSquare className="w-5 h-5 text-blue-600" />;
      default: return null;
    }
  };

  const getResultLabel = (result) => {
    const labels = {
      berhasil: "Berhasil",
      menolak: "Menolak",
      sibuk: "Sibuk",
      followup_lagi: "Follow Up Lagi"
    };
    return labels[result] || result;
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

  if (!lead || !customer || !score || !followups.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Lead tidak ditemukan</p>
            <Button onClick={() => navigate("/")} className="mt-4">Kembali ke Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // const { lead, customer, score, followups } = leadData;

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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2 btn-scale"
                  data-testid="add-followup-button"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Follow-up
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="followup-dialog">
                <DialogHeader>
                  <DialogTitle>Tambah Follow-up</DialogTitle>
                  <DialogDescription>
                    Catat hasil interaksi dengan nasabah
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="result">Hasil Follow-up *</Label>
                    <Select
                      value={followupForm.result}
                      onValueChange={(value) => setFollowupForm({ ...followupForm, result: value })}
                      required
                    >
                      <SelectTrigger id="result" data-testid="followup-result-select">
                        <SelectValue placeholder="Pilih hasil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="berhasil">Berhasil</SelectItem>
                        <SelectItem value="menolak">Menolak</SelectItem>
                        <SelectItem value="sibuk">Sibuk</SelectItem>
                        <SelectItem value="followup_lagi">Follow Up Lagi</SelectItem>
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
                      onChange={(e) => setFollowupForm({ ...followupForm, notes: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {followupForm.result === "followup_lagi" && (
                    <div className="space-y-2">
                      <Label htmlFor="next_action">Jadwal Follow-up Berikutnya</Label>
                      <Input
                        id="next_action"
                        data-testid="followup-next-action-input"
                        type="datetime-local"
                        value={followupForm.next_action_at}
                        onChange={(e) => setFollowupForm({ ...followupForm, next_action_at: e.target.value })}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    data-testid="submit-followup-button"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={submitting}
                  >
                    {submitting ? "Menyimpan..." : "Simpan Follow-up"}
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
            <Card className={`border-0 bg-gradient-to-br ${getBucketColor(score.bucket)} text-white shadow-xl`} data-testid="score-card">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {getBucketIcon(score.bucket)}
                </div>
                <h3 className="text-6xl font-bold heading-font mb-2">{(score.score * 100).toFixed(0)}%</h3>
                <p className="text-lg font-semibold uppercase tracking-wider mb-3">{score.bucket} Lead</p>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{customer.name}</h3>
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
                      <p className="font-medium capitalize">{customer.job.replace('.', '')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pendidikan</p>
                      <p className="font-medium capitalize">{customer.education}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status Pernikahan</p>
                      <p className="font-medium capitalize">{customer.marital}</p>
                    </div>
                  </div>
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
                  <span className="font-semibold text-gray-900">{formatCurrency(customer.balance)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Pinjaman Rumah</span>
                  </div>
                  <span className={`font-semibold ${customer.housing === 'yes' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {customer.housing === 'yes' ? 'Ya' : 'Tidak'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Pinjaman Personal</span>
                  </div>
                  <span className={`font-semibold ${customer.loan === 'yes' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {customer.loan === 'yes' ? 'Ya' : 'Tidak'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Default</span>
                  <span className={`font-semibold ${customer.has_default === 'yes' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {customer.has_default === 'yes' ? 'Ya' : 'Tidak'}
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
                      <p className="font-medium capitalize">{lead.contact_type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kontak Terakhir</p>
                      <p className="font-medium">{lead.last_contact_date}</p>
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
                  <p className="text-sm text-gray-600 mb-1">Status Lead</p>
                  <span className={`status-${lead.status.replace('_', '-')} inline-flex items-center gap-2`}>
                    {lead.status === 'closed_won' && <CheckCircle className="w-4 h-4" />}
                    {lead.status === 'closed_lost' && <XCircle className="w-4 h-4" />}
                    {lead.status === 'in_progress' && <Clock className="w-4 h-4" />}
                    {lead.status.replace('_', ' ').toUpperCase()}
                  </span>
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
                <CardDescription>Catatan interaksi dengan nasabah</CardDescription>
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
                              <span className="font-semibold text-gray-900">{getResultLabel(followup.result)}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(new Date(followup.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                            </span>
                          </div>

                          {followup.notes && (
                            <p className="text-sm text-gray-700 mb-3">{followup.notes}</p>
                          )}

                          {followup.next_action_at && (
                            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
                              <Clock className="w-3 h-3" />
                              <span>Next: {format(new Date(followup.next_action_at), 'dd MMM yyyy, HH:mm', { locale: id })}</span>
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
