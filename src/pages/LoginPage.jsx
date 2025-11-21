import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { TrendingUp, Lock, Mail, Sparkles } from "lucide-react";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "sales"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      // simulated loading for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Login berhasil!");
      navigate("/");
    } catch (error) {
      toast.error("Login gagal: " + (error.response?.data?.detail || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" data-testid="login-page">
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
              Portal Prioritas<br />
              <span className="gradient-text">Lead Intelligence</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sistem terintegrasi untuk mengelola lead dengan prioritas berbasis AI scoring.
              Tingkatkan konversi dengan data-driven insights.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Scoring</h3>
                <p className="text-sm text-gray-600">Lead diprioritaskan dengan machine learning untuk hasil maksimal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <TrendingUp className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-time Analytics</h3>
                <p className="text-sm text-gray-600">Dashboard interaktif dengan insights mendalam untuk tim sales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="animate-fadeIn">
          <Card className="shadow-2xl border-0 glass" data-testid="login-card">
            <CardHeader className="space-y-3 pb-6">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold heading-font gradient-text">SalesForce Nexus</h1>
              </div>
              <CardTitle className="text-2xl heading-font">
                {isLogin ? "Masuk ke Portal" : "Buat Akun Baru"}
              </CardTitle>
              <CardDescription>
                {isLogin ? "Masukkan kredensial Anda untuk mengakses dashboard" : "Daftar untuk memulai mengelola lead"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      data-testid="register-name-input"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    data-testid="login-email-input"
                    type="email"
                    placeholder="email@example.com"
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
                    data-testid="login-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      data-testid="register-role-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="sales">Sales</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}

                <Button
                  type="submit"
                  data-testid="login-submit-button"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 rounded-lg btn-scale"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  data-testid="toggle-auth-mode"
                >
                  {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
                </button>
              </div>

              {/* Quick login for testing */}
              {isLogin && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500 mb-3 text-center">Quick Login (Demo)</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickLogin("admin@salesportal.com", "admin123")}
                      className="flex-1 text-xs"
                      data-testid="quick-login-admin"
                    >
                      Admin
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickLogin("sales@salesportal.com", "sales123")}
                      className="flex-1 text-xs"
                      data-testid="quick-login-sales"
                    >
                      Sales
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
