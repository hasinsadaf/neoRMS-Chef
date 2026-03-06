import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard";
import AuthForm from "../../components/auth/AuthForm";
import { getMeAfterLogin, loginManagement } from "@/services/auth";
import { useAuth } from "../../context/AuthContext";

export default function ChefLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError("");

    try {
      const { accessToken, user } = await loginManagement({ email, password });
      const me = await getMeAfterLogin(accessToken);
      console.debug("/user/me response", me);

      const resolvedName = me?.fullName ?? user?.fullName ?? user?.name;
      const resolvedUserId = me?.id ?? user?.id;
      const resolvedTenantId = me?.Chef?.tenantId;
      const resolvedRestaurantId = me?.Chef?.restaurantId;
      const resolvedRole = me?.role ?? user?.role;

      login(accessToken, resolvedRole, resolvedName, resolvedTenantId, resolvedRestaurantId, resolvedUserId);
      if (me) updateUser(me);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" description="Sign in to manage your restaurant operations.">
      <AuthForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        submitLabel="Sign in"
      />
      <p className="mt-4 text-xs text-neutral-400">
        Use your assigned chef credentials to sign in.
      </p>
    </AuthCard>
  );
}