import './App.css';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle';
import Tabs from './components/tabs';
import { TabProvider } from './hooks/tab-provider';
import Editor from './components/yoopta';
import Layout from './components/layout';
import { NoteProvider } from './hooks/note-provider';

function App() {

    function greet() {
        //Greet(name).then(updateResultText);
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TabProvider>
                <NoteProvider>

                    <Layout>
                        <nav className='flex w-full justify-between p-2 pl-10'>
                            <div className='flex justify-center w-full'><Tabs /></div>
                            <ModeToggle />
                        </nav>
                        <Editor />
                    </Layout>

                </NoteProvider>
            </TabProvider>
        </ThemeProvider>

    )
}

export default App
