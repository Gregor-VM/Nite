import { createContext, useContext, useState } from "react"
import { main } from "wailsjs/go/models"

type TabProviderProps = {
  children: React.ReactNode
}

type TabProviderState = {
  currentTab: main.Tab
  setCurrentTab: (theme: main.Tab) => void
  loading: boolean
  setLoading: (value: boolean) => void
}

const initialState: TabProviderState = {
  currentTab: {ID: 1, Title: "Trash 🗑"},
  setCurrentTab: () => null,
  loading: false,
  setLoading: () => null
}

const TabProviderContext = createContext<TabProviderState>(initialState)

export function TabProvider({
  children,
  ...props
}: TabProviderProps) {
  const [tab, setTab] = useState<main.Tab>(initialState.currentTab)
  const [loading, setLoading] = useState(false);

  const value = {
    loading,
    setLoading,
    currentTab: tab,
    setCurrentTab: setTab
  }

  return (
    <TabProviderContext.Provider {...props} value={value}>
      {children}
    </TabProviderContext.Provider>
  )
}

export const useTab = () => {
  const context = useContext(TabProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a TabProvider")

  return context
}