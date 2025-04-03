import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useEffect } from "react"
import { CheckForZombieAssets, GetNotes } from "wailsjs/go/main/App"
import { useStateStore } from "@/store/store"

export function AppSidebar() {

    const currentTab = useStateStore(state => state.currentTab);
    const notes = useStateStore(state => state.notes);
    const currentNoteIndex = useStateStore(state => state.currentNoteIndex);
    const setNotes = useStateStore(state => state.setNotes);
    const setCurrentNoteIndex = useStateStore(state => state.setCurrentNoteIndex);


    const getNotes = async () => {
        const notes = await GetNotes(currentTab.ID);
        setNotes(notes);
    }

    const selectNote = (index: number) => {
        CheckForZombieAssets(currentTab?.ID, notes[currentNoteIndex]?.ID)
        if (currentTab.ID === notes[index].TabId) {
            setCurrentNoteIndex(index);
        }
    }

    useEffect(() => {
        if (currentTab) getNotes();
    }, [currentTab]);

    return (
        <Sidebar>
            <SidebarContent className="p-3">
                <h2 className='text-xl mb-3'>Nite</h2>
                <Input id="filter" placeholder='Filter/create note' autoComplete="off" />
                <div className="flex flex-col gap-2 mt-3">
                    {
                        notes.map((note, i) => {
                            return <Button key={note.ID} onClick={() => selectNote(i)} className="w-full justify-start" variant="ghost">{note.Title}</Button>
                        })
                    }
                </div>
            </SidebarContent>
        </Sidebar>
    )
}