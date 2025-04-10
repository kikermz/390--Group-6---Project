import Image from "next/image";

interface PostProps {
  content: string;
  username: string;
  media?: string;
  createdAt: string;
}

const Post = ({ content, username, media, createdAt }: { content: string, username: string, media?: string, createdAt: string }) => {
  // Determine if the media is an image or video based on the file extension
  const isImage = media ? media.match(/\.(jpeg|jpg|png|gif|webp)$/) : null;
  const isVideo = media ? media.match(/\.(mp4|webm|ogg)$/) : null;

  return (
    <div className="p-4 border-y-[1px] border-borderPurp">
      {/*Post Content*/}
      <div className="flex gap-4">
        {/*avatar*/}
        <div className="rounded-full overflow-hidden">
          <Image src="/icons/user.png" alt="User Image" width={30} height={30} />
        </div>

        {/*Content*/}
        <div className="flex-1 flex flex-col gap-2">
          {/*Header*/}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold">{username}</h1>
              <span className="text-xs text-gray-600">@{username}</span>
            </div>
            <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</span>
          </div>

          {/*Post Content*/}
          <p>{content}</p>

          {/*Media Content: Image or Video*/}
          {isImage ? (
            <Image
              src={`http://localhost:5000${media}`}
              alt="Post media"
              width={600}
              height={600}
            />
          ) : isVideo ? (
            <video controls width="600">
              <source src={`http://localhost:5000${media}`} type="video/mp4" />
              <source src={`http://localhost:5000${media}`} type="video/webm" />
              <source src={`http://localhost:5000${media}`} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Post;