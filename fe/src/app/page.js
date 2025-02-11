"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Courier New', Courier, monospace",
      }}
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient"
    >
      <Link
        href="/configure-world"
        className="text-white text-1xl font-bold animate-flicker"
      >
        start configuring your world
      </Link>

      {/* Background & Text Animation */}
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% { background-color: #000000; }
          50% { background-color: #111111; }
          100% { background-color: #000000; }
        }

        .bg-gradient {
          background: black;
          animation: gradientAnimation 4s ease-in-out infinite alternate;
          min-height: 100vh;
        }

        @keyframes flicker {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        .animate-flicker {
          animation: flicker 4s infinite;
          text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
