import { Link } from "@tanstack/react-router"
import { Button } from "../ui/button"

function Header() {

    return (

        <header className="bg-background dark text-white flex h-screen w-1/6 flex-col justify-start gap-16 border-b border-b-slate-300 p-8">
            <Link to='/'>
                <h1 className="text-2xl font-bold text-white">
                    better<span className="text-purple-500">vods</span>
                </h1>
            </Link>

            <nav className="flex flex-col gap-6">
                <Button variant="outline" asChild>
                    <Link to='/'>
                        Browse your VODs
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link to='/convert'>
                        Add new VOD
                    </Link>
                </Button>

                {
                    // <Button variant="outline" asChild>
                    //     <Link to='/support'>
                    //         Support my work!
                    //     </Link>
                    // </Button>
                }
                {
                    // <Button onClick={open} variant="secondary" className="absolute bottom-8">
                    //     Open VOD folder
                    // </Button>
                }

            </nav>
        </header>
    )
}

export default Header
