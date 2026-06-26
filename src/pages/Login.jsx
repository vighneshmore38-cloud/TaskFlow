import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiCheckSquare } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginSchema } from "../utils/validationSchemas";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    setServerError("");
    try {
      const loggedInUser = await login(values);
      showToast(`Welcome back, ${loggedInUser.fullName.split(" ")[0]}!`, "success");

      // Respect a deep link a ProtectedRoute might have redirected from,
      // otherwise send each role to its own dashboard.
      const intendedPath = location.state?.from?.pathname;
      const fallback = loggedInUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      navigate(intendedPath || fallback, { replace: true });
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
            <FiCheckSquare className="h-6 w-6" />
          </span>
          <h1 className="font-display text-2xl font-bold text-[var(--color-ink)]">
            Sign in to TaskFlow
          </h1>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Manage your team's tasks in one place
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@taskflow.com"
              icon={<FiMail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<FiLock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            {serverError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--color-danger)]">
                {serverError}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
              Log in
            </Button>
          </form>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 text-xs text-[var(--color-ink-soft)]">
          <p className="mb-1 font-medium text-[var(--color-ink)]">Demo credentials</p>
          <p>Admin — admin@taskflow.com / Admin@123</p>
          <p>User — priya@taskflow.com / User@123</p>
          <p className="mt-2 text-slate-400">
            There's no sign-up — only an admin can create new accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
