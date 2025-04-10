import './App.css';
import { ThemeProvider } from "@/components/theme-provider/theme-provider"
import Editor from './components/yoopta/yoopta';
import Layout from './components/layout/layout';
import { useEffect } from 'react';
import WindowBar from './components/window-bar/window-bar';
import Tabs from './components/tabs/tabs';

function App() {

    useEffect(() => {
        // Open all links externally
        /*window.document.body.addEventListener('click', function (e: any) {
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
        });*/

        (window as any).open = (url: string, target: string) => {
            (window as any).runtime.BrowserOpenURL(url);
        }

    }, []);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Layout>
                <WindowBar windowChildren={<Tabs />} />
                <Editor />
            </Layout>
        </ThemeProvider>
    )
}

export default App
