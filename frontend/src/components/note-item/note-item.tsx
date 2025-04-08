import { main } from "wailsjs/go/models"
import { Button } from "../ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface NoteItemProps {
    currentNoteIndex: number
    note: main.Note
    noteIndex: number
    currentTab: main.Tab
    selectNote: (i: number) => void
    restoreNote: (note: main.Note) => void
    handleDeletion: (note: main.Note) => void
}

function NoteItem({ currentNoteIndex, note, noteIndex, currentTab, selectNote, restoreNote, handleDeletion }: NoteItemProps) {

    return (
        <Button title={note.Title} key={note.ID} onClick={() => selectNote(noteIndex)} className={`w-full group/note px-2 pl-4 justify-between flex rounded-none ${currentNoteIndex === noteIndex ? "dark:bg-neutral-800 bg-neutral-100" : ""}`} variant="ghost">
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
    )
}

export default NoteItem