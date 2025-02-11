"use client";
import { useState, useContext } from "react";
import Link from "next/link";
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
        backgroundColor: "black",
        color: "white",
        fontFamily: "'Courier New', Courier, monospace",
        minHeight: "100vh",
        padding: "20px",
      }}
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20"
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <span>configure world setting</span>
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Enter world description..."
          style={{
            backgroundColor: "black",
            color: "white",
            borderWidth: "1px",
            borderColor: "white",
            borderRadius: "5px",
            padding: "10px",
            height: "200px",
            width: "500px",
            marginTop: "20px",
            marginBottom: "20px",
            fontFamily: "'Courier New', Courier, monospace",
          }}
        />
      </div>
      <Link
        href="/configure-characters"
        style={{
          fontWeight: "bold",
          color: "white",
          textDecoration: "underline",
        }}
        onClick={() => setConfiguration({ ...configuration, worldConfiguration: textValue })}
      >
        next
      </Link>
    </div>
  );
}
