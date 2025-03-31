import { main } from 'wailsjs/go/models'
import { create } from 'zustand'

type State = {
    currentTab: main.Tab
    tabLoading: boolean
    note: main.Note
    notes: main.Note[]
}

type Actions = {
    setCurrentTab: (tab: main.Tab) => void
    setTabLoading: (value: boolean) => void
    setNote: (note: main.Note) => void
    resetNote: () => void
    setNotes: (notes: main.Note[]) => void
}

const tabInitialState = { ID: 1, Title: "Trash 🗑" };
const noteInitialSTate = { ID: 0, Title: "", IsDeleted: true, TabId: 1 }

export const useStateStore = create<State & Actions>((set) => ({
    currentTab: tabInitialState,
    tabLoading: false,
    note: noteInitialSTate,
    notes: [],
    setCurrentTab: (tab: main.Tab) => set(() => ({ currentTab: tab })),
    setTabLoading: (value: boolean) => set(() => ({ tabLoading: value })),
    setNote: (note: main.Note) => set(() => ({ note })),
    resetNote: () => set(() => ({ note: noteInitialSTate })),
    setNotes: (notes: main.Note[]) => set(() => ({ notes }))
}))