import Image from "next/image"
import Link from "next/link"

const LeftBar = () => {
    return (
        <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
            {/*Menu Items*/}
            <div className="flex flex-col gap-4 text-lg items-center">
                {/*Company Logo*/}
                <Link href="/">
                    <Image src="/icons/CompLogoHolder.png" alt="C" width={24} height={24} />
                </Link>

                <div className="flex flex-col gap-2">
                    {/*Will Replace SEARCH with search bar */}
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Search</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Home</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Trending</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Inbox</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">News</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Notifications</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Saved</span>
                    </Link>
                    <Link href="/auth/login" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">Profile</span>
                    </Link>
                    <Link href="/" className="p-2 rounded-full hover:bg-[#301e48]">
                        <span className="">More ...</span>
                    </Link>

                </div>
            </div>

            {/*Profile*/}
            <div className="flex items-center justify-between gap-3">
                <div className="">
                    <Image src="/icons/user.png" alt="User Image" width={30} height={30} />
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold">User123</span>
                    <span className="text-xs ">@username</span>
                </div>
            </div>
        </div>
    )
}
export default LeftBar