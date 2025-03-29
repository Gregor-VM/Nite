import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, FormEvent, MouseEventHandler, SetStateAction, useRef } from "react"
import { InsertTab, UpdateTab } from "wailsjs/go/main/App"
import { main } from "wailsjs/go/models"

interface CreateTabProps {
    updateTabs: () => {}
    tabToEdit: main.Tab | null
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

export function CreateTab(
    {
        updateTabs,
        tabToEdit,
        open,
        setOpen
    } : CreateTabProps) {

  const titleRef = useRef<HTMLInputElement>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleRef.current?.value ?? ""
    if(!title) return;
    if(!tabToEdit) {
        const ok = await InsertTab(title);
        if(ok) setOpen(false);
        updateTabs();
        return;
    }

    const ok = await UpdateTab({...tabToEdit, Title: title});
    if(ok) setOpen(false);
    updateTabs();
    return;
  }

  return (
        <Dialog open={open} onOpenChange={setOpen}>
        {/*<DialogTrigger asChild>
            <Button variant="ghost"><Plus /></Button>
        </DialogTrigger>*/}
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={onSubmit}>
            <DialogHeader>
            <DialogTitle>{tabToEdit ? `Edit tab "${tabToEdit.Title}"` : 'Add New Tab'}</DialogTitle>
            <DialogDescription>
                You can named however you want, you can even use icons!
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Title
                    </Label>
                    <Input ref={titleRef} id="name" defaultValue={tabToEdit?.Title ?? ""} className="col-span-3" autoComplete="off" />
                </div>
                {/*<div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                    Username
                    </Label>
                    <Input id="username" value="@peduarte" className="col-span-3" />
                </div>*/}
            </div>
            <DialogFooter>
                <Button type="submit">
                    {tabToEdit ? "Update" : "Create Tab"}
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
  )
}