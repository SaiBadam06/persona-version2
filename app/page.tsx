import { AppProvider } from "@/lib/store";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { MainArea } from "@/components/MainArea";
import { ProfileModal } from "@/components/profile/ProfileModal";

export default function DashboardPage() {
  return (
    <AppProvider>
      <div className="flex h-screen w-full overflow-hidden bg-paper">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* Left-nav switches this: home (command + Today) / search / meetings / routines */}
            <MainArea />
          </div>
        </main>
      </div>

      {/* Profile = the customization hub, as a popup overlay (ChatGPT settings pattern) */}
      <ProfileModal />
    </AppProvider>
  );
}
