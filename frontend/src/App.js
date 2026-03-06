import { useEffect, useState } from "react";
import "./App.css";
import { ProfileHeader } from "./components/ProfileHeader";
import { ReelsStrip } from "./components/ReelsStrip";
import { PostGrid } from "./components/PostGrid";
import { CaseStudyMetrics } from "./components/CaseStudyMetrics";
import { Footer } from "./components/Footer";

function App() {
  const [apiWarning, setApiWarning] = useState("");
  const isDevelopment = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      const savedTheme = localStorage.getItem("theme");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    if (!isDevelopment) {
      return;
    }

    if (!backendUrl) {
      setApiWarning("REACT_APP_BACKEND_URL no está definido. La UI seguirá funcionando en modo local.");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const runHealthCheck = async () => {
      try {
        const response = await fetch(backendUrl, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          setApiWarning(`Backend no disponible (${response.status}). Mostrando UI con fallback local.`);
        }
      } catch {
        setApiWarning("No se pudo conectar al backend (CORS/red/timeout). Mostrando UI con fallback local.");
      } finally {
        clearTimeout(timeoutId);
      }
    };

    runHealthCheck();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isDevelopment]);

  return (
    <div className="app-container min-h-screen bg-background overflow-x-hidden" data-testid="app-container">
      {apiWarning ? (
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <p className="rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
            {apiWarning}
          </p>
        </div>
      ) : null}
      <main className="max-w-5xl mx-auto">
        <ProfileHeader />
        <ReelsStrip />
        <PostGrid />
        <CaseStudyMetrics />
      </main>
      <Footer />
    </div>
  );
}

export default App;
