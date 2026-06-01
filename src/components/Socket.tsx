"use client";

import { useEffect } from "react";
import { socket } from "@/socket";
import { useUser } from "@clerk/nextjs";

export default function Socket() {
  const { user } = useUser();

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      if (user) {
        socket.emit("newUser", user.username);
      }
    }

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, [user]);

  return (
    <span></span>
  );
}
