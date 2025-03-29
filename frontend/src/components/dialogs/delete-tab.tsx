import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Dispatch, SetStateAction} from "react"
import { DeleteTab as DeleteTabCallback } from "wailsjs/go/main/App"
import { main } from "wailsjs/go/models"

interface DeleteTabProps {
    updateTabs: () => {}
    tabToEdit: main.Tab | null
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

export function DeleteTab(
    {
        updateTabs,
        tabToEdit,
        open,
        setOpen
    } : DeleteTabProps) {

    const deleteTab = async () => {
        if(typeof tabToEdit?.ID !== "number") return;
        const ok = await DeleteTabCallback(tabToEdit.ID)
        if(ok) {
            setOpen(false);
            updateTabs();
        }
    }

  return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Tab deletion "{tabToEdit?.Title}"</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete the tab {tabToEdit?.Title}? ALL YOUR INFORMATION in the tab (including assets such as images, audios and videos) will be remove FOREVER!
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={deleteTab}>
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
  )
}