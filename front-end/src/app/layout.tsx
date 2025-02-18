import LeftBar from "@/components/LeftBar";
import "./styles.css";
import RightBar from "@/components/Rightbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body>
        <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto flex justify-between">
          <div className="px-2 sm:px-4"><LeftBar/></div>
          <div className="flex-1 lg:min-w-[700px] border-x-[1px] border-borderPurp">{children}</div>
          <div className="hidden lg:flex ml-4 flex-1"><RightBar/></div>
        </div>
      </body>
    </html>
  );
}