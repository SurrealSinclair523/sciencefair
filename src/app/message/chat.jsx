"use client";

import * as Ably from "ably";
import ChatBox from "./chat-box.jsx";

export default function Chat() {
  const client = new Ably.Realtime({
    key: "SeEuZw.Vt7RTg:1DsQxP43v9ARQOIVv6SYSebnT73NNi-UdxqbkD9dqGk",
  });
  return <ChatBox />;
}
