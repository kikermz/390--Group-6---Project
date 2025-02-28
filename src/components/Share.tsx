import Image from "next/image"

const Share = () => {
    return (
        <div className="p-4 flex gap-4">
            {/*Avatar*/}
            <div className="round-full overflow-hidden">
                <Image src="/icons/user.png" alt="User Image" width={30} height={30}/>
            </div>
            {/*Others*/}
            <div className="flex-1 flex flex-col gap 4">
                <input type="text" placeholder="Write a post..."/>
            </div>
            <div className="">
                <div className=""></div>
                <button className="bg-white text-black font-bold rounded-full py-2 px-4">Post</button>
            </div>
        </div>
    )
}
export default Share