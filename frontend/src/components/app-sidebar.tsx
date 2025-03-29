import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent className="p-3">
                <h2 className='text-xl mb-3'>Nite</h2>
                <Input id="filter" placeholder='Filter/create note' autoComplete="off" />
                <div className="flex flex-col gap-2 mt-3">
                    <Button className="w-full justify-start" variant="ghost">Notes for the first day</Button>
                    <Button className="w-full justify-start" variant="ghost">Things I need to organize</Button>
                    <Button className="w-full justify-start" variant="ghost">Games I want to download</Button>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}