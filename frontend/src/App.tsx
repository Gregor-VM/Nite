import './App.css';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle';
import Tabs from './components/tabs';
import Editor from './components/yoopta/yoopta';
import Layout from './components/layout';

function App() {

    function greet() {
        //Greet(name).then(updateResultText);
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Layout>
                <nav className='flex w-full justify-between p-2 pl-10'>
                    <div className='flex justify-center w-full'><Tabs /></div>
                    <ModeToggle />
                </nav>
                <Editor />
            </Layout>
        </ThemeProvider>
    )
}

export default App
