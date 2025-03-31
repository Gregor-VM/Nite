import { main } from 'wailsjs/go/models'
import { create } from 'zustand'

type State = {
    currentTab: main.Tab
    tabLoading: boolean
    notes: main.Note[]
    currentNoteIndex: number
}

type Actions = {
    setCurrentTab: (tab: main.Tab) => void
    setTabLoading: (value: boolean) => void
    setNotes: (notes: main.Note[]) => void
    setCurrentNoteIndex: (index: number) => void
}

const tabInitialState = { ID: 1, Title: "Trash 🗑" };
const noteInitialSTate = { ID: 0, Title: "", IsDeleted: true, TabId: 1 }

export const useStateStore = create<State & Actions>((set) => ({
    currentTab: tabInitialState,
    tabLoading: false,
    notes: [],
    setCurrentTab: (tab: main.Tab) => set(() => ({ currentTab: tab })),
    setTabLoading: (value: boolean) => set(() => ({ tabLoading: value })),
    setNotes: (notes: main.Note[]) => set(() => ({ notes })),
    currentNoteIndex: -1,
    setCurrentNoteIndex: (index: number) => set(() => ({ currentNoteIndex: index })),

}))