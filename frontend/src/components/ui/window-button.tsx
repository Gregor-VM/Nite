interface WindowButtonProps {
    onClick: () => void
    icon: React.ReactNode
    danger?: boolean
}

function WindowButton({ onClick, icon, danger = false }: WindowButtonProps) {
    return (
        <span className={`flex w-11 justify-center items-center px-3 py-2 ${danger ? "hover:bg-red-700 hover:text-white" : "dark:hover:bg-neutral-800 hover:bg-neutral-100"}`} onClick={onClick}>{icon}</span>
    )
}

export default WindowButton;