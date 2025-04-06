import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useStateStore } from "@/store/store"
import { Dispatch, SetStateAction } from "react"
import { DeleteNote as DeleteNoteCallback } from "wailsjs/go/main/App"
import { main } from "wailsjs/go/models"

interface DeleteNoteProps {
    updateNotes: () => void
    note: main.Note | null
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

export function DeleteNote(
    {
        updateNotes,
        note,
        open,
        setOpen
    }: DeleteNoteProps) {

    const setCurrentNoteIndex = useStateStore(state => state.setCurrentNoteIndex);

    const deleteNote = async () => {
        if (typeof note?.ID !== "number") return;
        const ok = await DeleteNoteCallback(note.TabId, note.ID)
        if (ok) {
            setCurrentNoteIndex(-1);
            setOpen(false);
            updateNotes();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Note deletion "{note?.Title}"</DialogTitle>
                    <DialogDescription>
                        {
                            note?.IsDeleted ? `Are you sure you want to delete the note '${note?.Title}'? ALL YOUR INFORMATION in the note (including assets such as images, audios and videos) will be remove FOREVER!` : `Are you sure to move the note '${note?.Title}' to Trash Tab?`
                        }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={deleteNote}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}