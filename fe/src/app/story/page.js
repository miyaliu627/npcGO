"use client";
import { useState } from "react";
import Link from "next/link";
import { useContext } from "react";
import { ConfigurationContext } from "../configuration-context";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const { configuration, setConfiguration } = useContext(ConfigurationContext);
  const [dialogue, setDialogue] = useState([
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
  ]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
    >
      <span>story page</span>
      <Link
        href="/configure-world"
        style={{ fontWeight: "bold" }}
        onClick={() => setConfiguration({ ...configuration, worldConfiguration: textValue })}
      >
        restart
      </Link>
      <span>configuration: {JSON.stringify(configuration)}</span>
      <div
        className="overflow-y-auto"
        style={{ height: 600, width: 1000, flexDirection: "column", display: "flex", justifyContent: "flex-start" }}
      >
        {dialogue.map(({ name, dialogue, key }) => (
          <Dialogue name={name} dialogue={dialogue} key={key} />
        ))}
      </div>
    </div>
  );
}

function Dialogue({ name, dialogue }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: 10 }}>
      <span style={{ fontWeight: "bold" }}>{name}</span>
      <span>{dialogue}</span>
    </div>
  );
}
