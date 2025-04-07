import './App.css';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle';
import Tabs from './components/tabs';
import Editor from './components/yoopta/yoopta';
import Layout from './components/layout';
import { useEffect } from 'react';
import { useStateStore } from './store/store';

function App() {

    const setIsTyping = useStateStore(state => state.setIsTyping);
    const isTyping = useStateStore(state => state.isTyping);

    function greet() {
        //Greet(name).then(updateResultText);
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
                <nav className={`flex w-full justify-between p-2 pl-10 transition-all duration-500 ${isTyping ? "opacity-0" : "opacity-100"}`}>
                    <div className='flex justify-center gap-2 w-11/12 mx-auto'><Tabs /></div>
                    <ModeToggle />
                </nav>
                <Editor />
            </Layout>
        </ThemeProvider>
    )
}

export default App
