import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { CheckForZombieAssets, RestoreNote, SearchNotes } from "wailsjs/go/main/App"
import { useStateStore } from "@/store/store"
import useDebounce from "@/hooks/use-debounce"
import { DeleteNote } from "../dialogs/delete-note"
import { main } from "wailsjs/go/models"
import nite from "@/assets/images/nite.png"
import { ModeToggle } from "../mode-toggle/mode-toggle"
import styles from './app-sidebar.module.css'
import NoteItem from "../note-item/note-item"
import CreateNewNoteButton from "../ui/create-new-note-button"

export function AppSidebar() {

    const currentTab = useStateStore(state => state.currentTab);
    const notes = useStateStore(state => state.notes);
    const currentNoteIndex = useStateStore(state => state.currentNoteIndex);
    const isTyping = useStateStore(state => state.isTyping);
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
                    <div className="flex items-center justify-between px-3 pt-2">
                        <h2 className='text-xl'>
                            <img className="w-14 dark:invert-100" src={nite} />
                        </h2>
                        <div className="flex justify-center items-center">
                            <ModeToggle />
                            <CreateNewNoteButton onClick={createNewNote} isVisible={currentNoteIndex !== -1 && !isTyping} />
                        </div>
                    </div>
                    <div className="mx-2">
                        <Input value={query} onChange={(e) => setQuery(e.target.value)} id="filter" className={styles.filter} placeholder='Filter notes' autoComplete="off" />
                    </div>
                    <div className="flex flex-col mt-3 overflow-y-auto overflow-x-hidden">
                        {
                            notes.map((note, i) => {
                                // TODO: Too many props here
                                return <NoteItem
                                    key={note.ID}
                                    currentNoteIndex={currentNoteIndex}
                                    currentTab={currentTab}
                                    note={note}
                                    noteIndex={i}
                                    handleDeletion={handleDeletion}
                                    restoreNote={restoreNote}
                                    selectNote={selectNote}
                                />
                            })
                        }
                    </div>
                </SidebarContent>
            </Sidebar>
            <DeleteNote open={open} setOpen={setOpen} updateNotes={updateNotes} note={selectedNote} />
        </>
    )
}