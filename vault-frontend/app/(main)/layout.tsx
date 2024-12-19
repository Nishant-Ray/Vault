import Link from "next/link";
import { dmSans } from "../ui/fonts";
import SideNav from "../ui/sideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-row">
        <div className="bg-white w-80 h-screen px-3 py-4 flex flex-col">
          <SideNav/>
        </div>

        <div className="w-full">
          <div className="bg-white px-5 h-20 flex flex-row justify-end items-center gap-x-6">
            <div className="w-10 h-10 bg-green-400"/>
            <div className="w-10 h-10 bg-orange-400"/>
          </div>

          <div className="w-full bg-off_white">{children}</div>
        </div>

      </div>
    </div>
  );
}
