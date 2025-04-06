import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { CheckForZombieAssets, RestoreNote, SearchNotes, UpdateNote } from "wailsjs/go/main/App"
import { useStateStore } from "@/store/store"
import useDebounce from "@/hooks/use-debounce"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { MoreVertical, PlusCircle } from 'lucide-react';
import { DeleteNote } from "./dialogs/delete-note"
import { main } from "wailsjs/go/models"

export function AppSidebar() {

    const currentTab = useStateStore(state => state.currentTab);
    const notes = useStateStore(state => state.notes);
    const currentNoteIndex = useStateStore(state => state.currentNoteIndex);
    const setNotes = useStateStore(state => state.setNotes);
    const setCurrentNoteIndex = useStateStore(state => state.setCurrentNoteIndex);

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<main.Note | null>(null);

    const queryDebounced = useDebounce(query, 150);

    const createNewNote = () => {
        CheckForZombieAssets(currentTab?.ID, notes[currentNoteIndex]?.ID);
        setCurrentNoteIndex(-1);
    }

    const getNotes = async (query: string) => {
        const notes = await SearchNotes(currentTab.ID, query);
        setNotes(notes);
    }

    const selectNote = (index: number) => {
        CheckForZombieAssets(currentTab?.ID, notes[currentNoteIndex]?.ID)
        setCurrentNoteIndex(index);
    }

    const handleDeletion = (note: main.Note) => {
        setSelectedNote(note);
        setOpen(true);
    }

    const updateNotes = () => {
        getNotes(queryDebounced)
    }

    const restoreNote = async (note: main.Note) => {
        if (note?.ID) await RestoreNote(note.ID);
        setCurrentNoteIndex(-1);
        getNotes(queryDebounced)
    }

    useEffect(() => {
        if (currentTab) getNotes(queryDebounced);
    }, [currentTab, queryDebounced]);

    return (
        <>
            <Sidebar>
                <SidebarContent>
                    <div className="flex items-center justify-between p-3">
                        <h2 className='text-xl mb-3'>Nite</h2>
                        <span onClick={createNewNote}
                            title="Create new note" role="button" className={`
                        ${currentNoteIndex === -1 ? "invisible opacity-0" : "visible opacity-100"}
                        hover:bg-neutral-600 rounded-full
                        shadow-sm hover:scale-125 hover:shadow-neutral-600 hover:rotate-90 transition-all duration-350 transition-discrete
                        `}><PlusCircle /></span>
                    </div>
                    <div className="mx-2">
                        <Input value={query} onChange={(e) => setQuery(e.target.value)} id="filter" placeholder='Filter notes' autoComplete="off" />
                    </div>
                    <div className="flex flex-col mt-3 overflow-y-auto">
                        {
                            notes.map((note, i) => {
                                return <Button title={note.Title} key={note.ID} onClick={() => selectNote(i)} className="w-full group/note px-2 pl-4 justify-between flex rounded-none" variant="ghost">
                                    <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                                        {note.Title}
                                    </span>
                                    <div onClick={e => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button title="Options" className="w-2 h-6 opacity-0 group-hover/note:opacity-100 outline-none border-none shadow-none transition-all duration-200" variant="ghost"><MoreVertical /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {currentTab?.ID === 1 && note?.TabId !== 1 && <DropdownMenuItem onClick={() => restoreNote(note)}>Restore</DropdownMenuItem>}
                                                <DropdownMenuItem onClick={() => handleDeletion(note)} variant="destructive" >Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </Button>
                            })
                        }
                    </div>
                </SidebarContent>
            </Sidebar>
            <DeleteNote open={open} setOpen={setOpen} updateNotes={updateNotes} note={selectedNote} />
        </>
    )
}