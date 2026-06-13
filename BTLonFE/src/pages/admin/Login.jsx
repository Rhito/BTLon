import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { APP_NAME } from "@/config/app";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isChecking } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Already logged in → redirect dashboard
  useEffect(() => {
    if (!isChecking && isAuthenticated) {
      const from = location.state?.from?.pathname ?? "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isChecking, navigate, location.state]);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email address";
    if (!form.password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      await login(form.email, form.password);
      const from = location.state?.from?.pathname ?? "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      const status = err?.status;

      if (status === 429) {
        setServerError("Too many login attempts. Please try again later.");
      } else if (status === 401 || status === 422) {
        setServerError(err?.message ?? "Invalid email or password.");
      } else {
        setServerError(
          err?.message ?? "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while checking token on mount
  if (isChecking) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">{APP_NAME}</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <Input
              id="email"
              type="email"
              label="Email"
              required
              placeholder="admin@gmail.com"
              value={form.email}
              error={errors.email}
              onChange={handleChange("email")}
              autoComplete="email"
            />

            {/* Password */}
            <Input
              id="password"
              type={showPass ? "text" : "password"}
              label="Password"
              required
              placeholder="••••••••"
              value={form.password}
              error={errors.password}
              onChange={handleChange("password")}
              autoComplete="current-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            {/* Server error */}
            {serverError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {serverError}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
