"use client";

import dynamic from "next/dynamic";

const Chat = dynamic(() => import("./chat"));

function page() {
  return (
    <main>
      <Chat />
    </main>
  );
}

export default page;
