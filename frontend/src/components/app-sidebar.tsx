import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { GetNotes } from "wailsjs/go/main/App"
import { useTab } from "@/hooks/tab-provider"
import { main } from "wailsjs/go/models"
import { useNoteState } from "@/hooks/note-provider"

export function AppSidebar() {

    const { currentTab } = useTab();
    const { setId, setTitle } = useNoteState();
    const [notes, setNotes] = useState<main.Note[]>([]);

    const getNotes = async () => {
        const notes = await GetNotes(currentTab.ID);
        setNotes(notes);
    }

    const selectNote = (note: main.Note) => {
        if (currentTab.ID === note.TabId) {
            setId(note.ID);
            setTitle(note.Title);
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
                        notes.map(note => {
                            return <Button onClick={() => selectNote(note)} className="w-full justify-start" variant="ghost">{note.Title}</Button>
                        })
                    }
                </div>
            </SidebarContent>
        </Sidebar>
    )
}