import { useStateStore } from "@/store/store";
import { Minus, Square, Copy, X } from "lucide-react";
import WindowButton from "../ui/window-button";

// TODO: This buttons should vary depending the operating system
function WindowsButtons() {

    const isMaximaze = useStateStore(state => state.isMaximaze);
    const setIsMaximaze = useStateStore(state => state.setIsMaximaze);

    const handleMinimise = () => {
        (window as any).runtime.WindowMinimise()
    }

    const handleMaximaze = () => {
        if (isMaximaze) (window as any).runtime.WindowUnmaximise();
        else (window as any).runtime.WindowMaximise(); setIsMaximaze(!isMaximaze)
    }

    const handleQuit = () => {
        (window as any).runtime.Quit()
    }

    return (
        <div className="flex p-[0.15rem] avoiddrag">
            <WindowButton icon={<Minus width={17} />} onClick={handleMinimise} />
            <WindowButton icon={!isMaximaze ? <Square width={12} /> : <Copy style={{ transform: "rotateY(180deg)" }} width={14} />} onClick={handleMaximaze} />
            <WindowButton danger={true} icon={<X width={17} />} onClick={handleQuit} />
        </div>
    )
}

export default WindowsButtons