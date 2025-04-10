import { useStateStore } from '@/store/store';
import { useEffect, useState } from 'react';
import WindowsButtons from '../window-buttons/window-buttons';
import { Platform } from 'wailsjs/go/main/App';

interface WindowBarProps {
    windowChildren: React.ReactNode
}

function WindowBar({ windowChildren }: WindowBarProps) {

    const [showButtons, setShowButtons] = useState(false);

    const setIsTyping = useStateStore(state => state.setIsTyping);
    const isTyping = useStateStore(state => state.isTyping);
    const isMaximaze = useStateStore(state => state.isMaximaze);
    const setIsMaximaze = useStateStore(state => state.setIsMaximaze);

    const toggleMaximaze = () => {
        isMaximaze ? (window as any).runtime.WindowUnmaximise() : (window as any).runtime.WindowMaximise(); setIsMaximaze(!isMaximaze)
    }

    const loadPlatform = async () => {
        const platform = await Platform();
        if (platform === "windows") {
            setShowButtons(true);
        }
    }

    useEffect(() => {

        loadPlatform()

        const onMouseMoveHandler = function () {
            setIsTyping(false);
        }
        window.addEventListener("mousemove", onMouseMoveHandler);

        return () => {
            window.removeEventListener("mousemove", onMouseMoveHandler);
        }
    }, []);

    return (
        <>
            <nav onDoubleClick={() => showButtons && toggleMaximaze()} className={`${showButtons ? "allowdrag" : ""} flex w-full justify-between pl-10 border-b-1 dark:border-neutral-800 border-neutral-200`}>
                <div className={`flex justify-center gap-2 w-full ${showButtons ? "pr-50" : "pr-5"} ml-4 transition-all duration-500 ${isTyping ? "opacity-0" : "opacity-100"}`}>{windowChildren}</div>
            </nav>
            <div className='absolute right-0 top-0'>{showButtons && <WindowsButtons />}</div>
        </>
    )
}

export default WindowBar