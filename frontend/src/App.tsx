import './App.css';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle';
import Tabs from './components/tabs';
import Editor from './components/yoopta/yoopta';
import Layout from './components/layout';
import { useEffect } from 'react';
import { useStateStore } from './store/store';
import WindowsButtons from './components/windowbuttons/windowbuttons';

function App() {

    const setIsTyping = useStateStore(state => state.setIsTyping);
    const isTyping = useStateStore(state => state.isTyping);
    const isMaximaze = useStateStore(state => state.isMaximaze);
    const setIsMaximaze = useStateStore(state => state.setIsMaximaze);

    const toggleMaximaze = () => {
        isMaximaze ? (window as any).runtime.WindowUnmaximise() : (window as any).runtime.WindowMaximise(); setIsMaximaze(!isMaximaze)
    }

    useEffect(() => {
        // Open all links externally
        window.document.body.addEventListener('click', function (e: any) {
            if (e.target && e.target.nodeName == 'A' && e.target.href) {
                const url = e.target.href;
                if (
                    !url.startsWith('http://#') &&
                    !url.startsWith('file://') &&
                    !url.startsWith('http://wails.localhost:')
                ) {
                    e.preventDefault();
                    //(window as any).runtime.BrowserOpenURL(url);
                }
            }
        });

        (window as any).open = (url: string, target: string) => {
            (window as any).runtime.BrowserOpenURL(url);
        }

        window.addEventListener("mousemove", function (e) {
            setIsTyping(false);
        });

    }, []);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Layout>
                <nav onDoubleClick={toggleMaximaze} className="appnavbar flex w-full justify-between pl-10 border-b-1 dark:border-neutral-800 border-neutral-200">
                    <div className={`flex justify-center gap-2 w-full pr-50 ml-4 transition-all duration-500 ${isTyping ? "opacity-0" : "opacity-100"}`}><Tabs /></div>
                    {/*<ModeToggle />*/}
                </nav>
                <div className='absolute right-0 top-0'><WindowsButtons /></div>
                <Editor />
            </Layout>
        </ThemeProvider>
    )
}

export default App
