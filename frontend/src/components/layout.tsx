import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { useStateStore } from "@/store/store";

export default function Layout({ children }: { children: React.ReactNode }) {
    const isTyping = useStateStore(state => state.isTyping);
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full max-w-screen min-h-screen overflow-hidden flex flex-col">
                <SidebarTrigger className={`fixed mt-1 ml-1 transition-all duration-500 ${isTyping ? "opacity-0" : "opacity-100"}`} />
                {children}
            </main>
        </SidebarProvider>
    )
}