import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className='absolute z-50 border-t-1 bottom-0 flex h-6 w-full text-sm justify-center border-t text-white bg-background dark'>
            {/* <Separator className='' /> */}
            <p className='h-24 text-center text-sm'>
                Made with{" "}
                <Heart className='mx-1 inline' fill='red' width={20} height={20} /> by
                Kaylee
            </p>
        </footer>
    );
}
