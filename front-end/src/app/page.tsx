import Feed from "@/components/Feed"
import Share from "@/components/Share"
import Link from "next/link"

const Homepage = () => {
  return(
    <div className="">
      <div className="px-4 pt-4 flex justify-between font-bold border-b-[1px] border-borderPurp">
          <Link className="pb-3 flex items-center " href="/">For You</Link>
          <Link className=" pb-3 flex items-center " href="/">Following</Link>
          <Link className="pb-3 flex items-center " href="/">Lives</Link>
      </div>
      <Share/>
      <Feed/>
      
    </div>
  )
}

export default Homepage