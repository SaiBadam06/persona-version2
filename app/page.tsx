import { AppProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/Toast";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { MainArea } from "@/components/MainArea";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { MeetingDetailModal } from "@/components/MeetingDetailModal";
import { DraftPreviewModal } from "@/components/DraftPreviewModal";

export default function DashboardPage() {
  return (
    <AppProvider>
      <ToastProvider>
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

        {/* Overlays - every section opens one of these */}
        <ProfileModal />
        <MeetingDetailModal />
        <DraftPreviewModal />
      </ToastProvider>
    </AppProvider>
  );
}
