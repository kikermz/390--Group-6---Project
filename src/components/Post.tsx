import Image from "next/image"

const Post = () => {
    return(
      <div className="p-4 border-y-[1px] border-borderPurp">
        {/*Post Content*/}
        <div className="flex gap-4">
          {/*avatar*/}
          <div className="rounded-full overflow-hidden">
            <Image src="/icons/user.png" alt="User Image" width={30} height={30}/>
          </div>
            
            {/*Content*/}
            <div className="flex-1 flex flex-col gap-2">
              {/*Header*/}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-bold">User123</h1>
                  <span className="text-xs text-gray-600">@username</span>
                </div>
              </div>
              {/*Media Content*/}
            
              <p className="">Nothing like a day at the beach with nothing to do but relax </p>
              <Image src="/general/beach.jpg" alt="Rain on window with book infront"width={600} height={600}/>
            </div>
        </div>
      </div>
      
    )
  }
  
  export default Post