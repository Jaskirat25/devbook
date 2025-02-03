"use client";

import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import Image from "./Image";

const Logout = () => {
  const [open, setOpen] = useState(false);

  const { signOut } = useClerk();

  return (
    <div className="hidden xxl:block relative">
      <div
        className="cursor-pointer font-bold"
        onClick={() => setOpen((prev) => !prev)}
      >
        ...
      </div>
      {open && (
        <div className=" bg-white py-6 px-8 rounded-xl absolute left-4 bottom-4 flex flex-col gap-2 w-max">
          <Link
            href="/profile"
            className="text-textGray text-sm"
            onClick={() => setOpen(false)}
          >
            User Profile
          </Link>
          <Link
            href="/profile"
            className="text-textGray text-sm"
            onClick={() => setOpen(false)}
          >
            Saved Posts
          </Link>
          <Link
            href="/profile"
            className="text-textGray text-sm"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
          <hr />
          <button
            className="bg-black rounded-md px-2 py-1 "
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Logout;