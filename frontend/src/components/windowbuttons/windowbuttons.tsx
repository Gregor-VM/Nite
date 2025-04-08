import { useStateStore } from "@/store/store";
import { Minus, Square, Copy, X } from "lucide-react";
import { useMemo } from "react";

// TODO: This buttons should vary depending the operating system
function WindowsButtons() {

    const isMaximaze = useStateStore(state => state.isMaximaze);
    const setIsMaximaze = useStateStore(state => state.setIsMaximaze);

    const buttons = useMemo(() => [
        { icon: <Minus width={17} />, onClick: () => (window as any).runtime.WindowMinimise() },
        { icon: !isMaximaze ? <Square width={12} /> : <Copy style={{ transform: "rotateY(180deg)" }} width={14} />, onClick: () => { isMaximaze ? (window as any).runtime.WindowUnmaximise() : (window as any).runtime.WindowMaximise(); setIsMaximaze(!isMaximaze) } },
        { icon: <X width={17} />, onClick: () => (window as any).runtime.Quit() },
    ], [isMaximaze]);

    return (
        <div className="flex p-[0.15rem] avoiddrag">
            {buttons.map((button, i) => {
                return <span key={i} className={`flex w-11 justify-center items-center px-3 py-2 ${i == 2 ? "hover:bg-red-700 hover:text-white" : "dark:hover:bg-neutral-800 hover:bg-neutral-100"}`} onClick={button.onClick}>{button.icon}</span>
            })}
        </div>
    )
}

export default WindowsButtons