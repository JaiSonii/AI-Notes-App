import { useEffect, useState } from "react";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css"

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [view, setView] = useState<"login" | "register" | "dashboard">(
    token ? "dashboard" : "login"
  );

  useEffect(() => {
    setView(token ? "dashboard" : "login");
  }, [token]);

  if (view !== "dashboard") {
    return (
      <AuthPage
        type={view}
        setToken={setToken}
        switchTo={() =>
          setView(view === "login" ? "register" : "login")
        }
      />
    );
  }

  return (
    <Dashboard
      logout={() => {
        localStorage.removeItem("token");
        setToken(null);
      }}
    />
  );
}
