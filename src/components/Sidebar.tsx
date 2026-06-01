import React from "react";
import Link from "next/link";
import Image from "./Image";
import { Home, Search, Bell, MessageSquare, Bookmark, Briefcase, Users, Star, User, MoreHorizontal } from "lucide-react";

const menuList = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Explore", icon: Search, href: "/explore" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
  { name: "Messages", icon: MessageSquare, href: "/messages" },
  { name: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { name: "Jobs", icon: Briefcase, href: "/jobs" },
  { name: "Communities", icon: Users, href: "/communities" },
  { name: "Premium", icon: Star, href: "/premium" },
  { name: "Profile", icon: User, href: "/profile" },
  { name: "More", icon: MoreHorizontal, href: "/more" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 p-4 bg-black">
      <Link href="/" className="flex items-center justify-center mb-8">
        <Image path="icons/logo.svg" alt="logo" w={32} h={32} />
      </Link>
      <nav className="flex flex-col gap-2">
        {menuList.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-zinc-800 transition-colors"
          >
            <item.icon className="w-5 h-5 text-zinc-400" />
            <span className="hidden xl:inline text-sm text-zinc-200">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
