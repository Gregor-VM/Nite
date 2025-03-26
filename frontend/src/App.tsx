import './App.css';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle';
import Tabs from './components/tabs';

function App() {

    function greet() {
        //Greet(name).then(updateResultText);
    }

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <nav className='flex w-full justify-between p-3'>
            <h2 className='text-xl'>Nite</h2>
            <Tabs />
            <ModeToggle />
        </nav>
        </ThemeProvider>
    )
}

export default App
