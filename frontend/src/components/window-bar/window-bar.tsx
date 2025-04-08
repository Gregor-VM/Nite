import { useStateStore } from '@/store/store';
import { useEffect } from 'react';
import WindowsButtons from '../window-buttons/window-buttons';

interface WindowBarProps {
    windowChildren: React.ReactNode
}

function WindowBar({ windowChildren }: WindowBarProps) {

    const setIsTyping = useStateStore(state => state.setIsTyping);
    const isTyping = useStateStore(state => state.isTyping);
    const isMaximaze = useStateStore(state => state.isMaximaze);
    const setIsMaximaze = useStateStore(state => state.setIsMaximaze);

    const toggleMaximaze = () => {
        isMaximaze ? (window as any).runtime.WindowUnmaximise() : (window as any).runtime.WindowMaximise(); setIsMaximaze(!isMaximaze)
    }

    useEffect(() => {
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
            <nav onDoubleClick={toggleMaximaze} className="appnavbar flex w-full justify-between pl-10 border-b-1 dark:border-neutral-800 border-neutral-200">
                <div className={`flex justify-center gap-2 w-full pr-50 ml-4 transition-all duration-500 ${isTyping ? "opacity-0" : "opacity-100"}`}>{windowChildren}</div>
            </nav>
            <div className='absolute right-0 top-0'><WindowsButtons /></div>
        </>
    )
}

export default WindowBar