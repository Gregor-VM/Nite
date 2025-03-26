import React, { useCallback, useState } from 'react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react';
import { Greet } from 'wailsjs/go/main/App'

const tasks = [
    {
        id: 1,
        name: "Trash 🗑",
    },
    {
        id: 2,
        name: "Job",
    }
].reverse()


function Tabs() {

  const [selected, setSelected] = useState(tasks[0].id);

  const getButtonVariant = useCallback((taskId: number) => {
    return selected === taskId ? "secondary" : "ghost"
  }, [selected])

  const changeTab = (taskId: number) => setSelected(taskId);

  const addNewTab = async () => {

    const res = await Greet("Gregor")
    console.log(res)

  }

  return (
    <nav className="flex gap-2">
        {tasks.map(task => {
            return  <Button 
            onClick={() => changeTab(task.id)}
            variant={getButtonVariant(task.id)}
            >{task.name}</Button>
        })}
        <Button onClick={addNewTab} variant="ghost">
            <Plus />
        </Button>
    </nav>
  )
}

export default Tabs