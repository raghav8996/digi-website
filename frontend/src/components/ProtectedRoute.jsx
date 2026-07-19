import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, checked } = useAuth();
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white/60 text-sm">
        Checking session…
      </div>
    );
  }
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
