import React, { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { TrendingUp, Lock, Mail, Sparkles } from "lucide-react";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user && data.user.role === "admin") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success("Admin login berhasil!");
          navigate("/admin" , { replace: true });
        } else {
          toast.error("Hanya admin yang dapat login di halaman ini");
        }
      } else {
        throw new Error("Login gagal");
      }
    } catch (error) {
      // Fallback: Demo login if backend unreachable
      if (
        formData.email === "admin@example.com" &&
        formData.password === "admin123"
      ) {
        const demoUser = {
          id: 0,
          name: "Demo Admin",
          role: "admin",
          email: "admin@example.com"
        };
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("user", JSON.stringify(demoUser));
        toast.success("Admin login berhasil (Demo Mode)!");
        navigate("/admin" , { replace: true });
      } else {
        toast.error("Login gagal: " + (error.message || "Terjadi kesalahan"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" data-testid="admin-login-page">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8 animate-slideIn">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold heading-font gradient-text">SalesForce Nexus</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold heading-font text-gray-900 leading-tight">
              Portal Admin<br />
              <span className="gradient-text">Manajemen Sistem</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sistem administrasi untuk mengelola pengguna, lead, dan pengaturan aplikasi SalesForce Nexus.
              Kelola akses dan monitor performa sistem.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Kontrol Penuh</h3>
                <p className="text-sm text-gray-600">Kelola semua aspek sistem dengan panel administrasi terpadu</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <TrendingUp className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Monitoring Real-time</h3>
                <p className="text-sm text-gray-600">Pantau aktivitas sistem dan performa aplikasi secara langsung</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="animate-fadeIn">
          <Card className="shadow-2xl border-0 glass" data-testid="admin-login-card">
            <CardHeader className="space-y-3 pb-6">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold heading-font gradient-text">SalesForce Nexus</h1>
              </div>
              <CardTitle className="text-2xl heading-font">Masuk Portal Admin</CardTitle>
              <CardDescription>
                Masukkan kredensial admin untuk mengakses panel administrasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    data-testid="admin-login-email-input"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    data-testid="admin-login-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  data-testid="admin-login-submit-button"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 rounded-lg btn-scale"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login", { replace: true })}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Kembali ke Login Biasa
                </Button>
              </div>

              {/* Demo credentials info */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 mb-3 text-center">Demo Credentials</p>
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                  <p><span className="font-semibold">Email:</span> admin@example.com</p>
                  <p><span className="font-semibold">Password:</span> admin123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
