"use client";
import { useState } from "react";
import Link from "next/link";
import { useContext } from "react";
import { ConfigurationContext } from "../configuration-context";

export default function Home() {
  const [textValue, setTextValue] = useState("");
  const { configuration, setConfiguration } = useContext(ConfigurationContext);
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
      <div
        style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}
        className="font-[family-name:var(--font-geist-sans)]"
      >
        <span>configure world setting</span>
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Enter world description..."
          style={{
            backgroundColor: "black",
            borderWidth: 1,
            borderColor: "white",
            padding: 10,
            height: 200,
            width: 500,
            marginTop: 20,
            marginBottom: 20,
          }}
        />
      </div>
      <Link
        href="/configure-characters"
        style={{ fontWeight: "bold" }}
        onClick={() => setConfiguration({ ...configuration, worldConfiguration: textValue })}
      >
        next
      </Link>
    </div>
  );
}
