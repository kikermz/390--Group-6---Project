import Link from "next/link"
import Image from "next/image"

const UserPage = () => {
return(
    <div className="">
        {/*PROFILE TITLE*/}
        <div className='flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg bg-purple-800'>
            <link href = '/'></link>
            <h1 className="font-bold text-lg">John Doe</h1>
        </div>
        {/*INFO*/}
        <div className="">
            {/*COVER + AVATAR CONTAINER*/}
            <div className="relative w-full">

                {/*COVER*/}
                <div className="w-full aspect-[3-1] relative">
                    <Image src="/general/BGI1.jpg" alt="Background Image" width={800} height={10}/>
                </div>    

                {/*AVATAR*/}
                <div className="w-1/5 aspect-square rounded-full overflow-hidden border-[4px]  border-purple-600 bg-black absolute left-4 -translate-y-1/2">
                    <Image src = "/icons/user.png" alt = "Avatar Image" width={250} height={250}/>
                </div>
            </div>
        </div>
        
        <div className="flex w-full items-center justify-end gap-2 p-2">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white border-[3px] border-purple-600 cursor-pointer">
                <Image src="/icons/more.png" alt="more" width={25} height={25}/>
            </div>

            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white border-[3px] border-purple-600 cursor-pointer">
                <Image src="/icons/message.png" alt="more" width={25} height={25}/>
            </div>

            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white border-[3px] border-purple-600 cursor-pointer">
                <Image src="/icons/explore.png" alt="more" width={25} height={25}/>
            </div>
        </div>
        <Image src="/general/beach.jpg" alt="Background Image" width={800} height={75}/>
        <Image src="/general/beach.jpg" alt="Background Image" width={800} height={75}/>
        <Image src="/general/beach.jpg" alt="Background Image" width={800} height={75}/>
    </div> 
)
}
export default UserPage

