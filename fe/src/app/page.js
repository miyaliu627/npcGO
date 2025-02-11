"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        color: "white",
        fontFamily: "'Courier New', Courier, monospace",
      }}
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
    >
      <Link href="/configure-world" className="text-white">
        start configuring your world
      </Link>
    </div>
  );
}
