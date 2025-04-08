import { PlusCircle } from 'lucide-react'

interface CreateNewNoteButtonProps {
  onClick: () => void
  isVisible: boolean
}

function CreateNewNoteButton({ onClick, isVisible }: CreateNewNoteButtonProps) {
  return (
    <span onClick={onClick}
      title="Create new note" role="button" className={`
    ${isVisible ? "visible opacity-100 w-min ml-2" : "invisible opacity-0 w-0"}
    dark:hover:bg-neutral-600 hover:bg-neutral-50
      rounded-full
    shadow-sm hover:scale-125 
    dark:hover:shadow-neutral-600 hover:shadow-neutral-50
    hover:rotate-90 transition-all duration-350 transition-discrete overflow-hidden
    `}><PlusCircle /></span>
  )
}

export default CreateNewNoteButton