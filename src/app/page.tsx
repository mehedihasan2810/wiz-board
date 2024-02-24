import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function Home() {
  return (
    <main>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <DashboardLayout />
      </ThemeProvider>
    </main>
  );
}
