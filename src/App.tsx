import { useEffect } from "react";
import "./App.css";
import { Converter } from "./components/forms";

function App() {
    useEffect(() => {
        const twitchScript = document.createElement('script');

        twitchScript.src = 'https://player.twitch.tv/js/embed/v1.js'
        document.body.appendChild(twitchScript);

        return () => {
            document.body.removeChild(twitchScript)
        }
    }, [])
    return (
        <>
            <script src="https://player.twitch.tv/js/embed/v1.js" async></script>
            <main className="dark bg-background text-white h-screen w-screen flex flex-col justify-center items-center">
                <Converter />
            </main>
        </>
    );
}

export default App;
