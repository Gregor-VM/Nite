import { createContext, useCallback, useContext, useState } from "react"

type NoteProviderProps = {
  children: React.ReactNode
}

type NoteProviderState = {
  id: number
  title: string
  setTitle: (title: string) => void
  setId: (id: number) => void
  reset: () => void
}

const initialState: NoteProviderState = {
  id: 0,
  title: "",
  setTitle: () => { },
  setId: () => { },
  reset: () => { }
}

const NoteProviderContext = createContext<NoteProviderState>(initialState)

export function NoteProvider({
  children,
  ...props
}: NoteProviderProps) {
  const [state, setState] = useState<NoteProviderState>(initialState)

  const value = {
    ...state,
    setTitle: useCallback((title: string) => setState(prev => ({ ...prev, title })), []),
    setId: useCallback((id: number) => setState(prev => ({ ...prev, id })), []),
    reset: useCallback(() => setState(initialState), [])
  }

  return (
    <NoteProviderContext.Provider {...props} value={value}>
      {children}
    </NoteProviderContext.Provider>
  )
}

export const useNoteState = () => {
  const context = useContext(NoteProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a NoteProvider")

  return context
}