import { AuthProvider } from "./components/AuthProvider";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { AppRouter } from "./router/AppRouter";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider >
        <Toaster richColors />
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
