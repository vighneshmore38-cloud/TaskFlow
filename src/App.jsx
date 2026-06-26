import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

/**
 * Provider order matters: ToastProvider wraps AuthProvider so that
 * even auth-related actions (login/logout) can trigger toasts.
 * BrowserRouter wraps everything so AuthProvider/ProtectedRoute can
 * use router hooks like useNavigate/useLocation. ThemeProvider doesn't
 * depend on any of the others, so its position is flexible — it sits
 * outermost simply so the theme is ready before anything else renders.
 */
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
