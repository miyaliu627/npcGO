"use client";
import { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { ConfigurationContext } from "../configuration-context";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const { configuration, setConfiguration } = useContext(ConfigurationContext);
  const [dialogue, setDialogue] = useState([
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
    { name: "harry potter", dialogue: "hi", key: uuidv4() },
  ]);

  const dialogueRef = useRef(null);

  // Auto-scroll to the bottom when new dialogue appears
  useEffect(() => {
    if (dialogueRef.current) {
      dialogueRef.current.scrollTop = dialogueRef.current.scrollHeight;
    }
  }, [dialogue]);

  // Function to add more messages
  const addDialogue = () => {
    setDialogue((prevDialogue) => [
      ...prevDialogue,
      { name: "harry potter", dialogue: `message ${prevDialogue.length + 1}`, key: uuidv4() },
    ]);
  };

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
        position: "relative",
        width: "100%",
      }}
    >
      {/* Restart Link in Upper Right Corner */}
      <Link
        href="/configure-world"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontWeight: "bold",
          color: "white",
          textDecoration: "underline",
        }}
        onClick={() => setConfiguration({ ...configuration, worldConfiguration: "" })}
      >
        restart
      </Link>

      {/* Scrollable dialogue area */}
      <div
        ref={dialogueRef}
        style={{
          height: "600px",
          width: "1000px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          overflowY: "auto", 
          padding: "10px",
          border: "0px solid white",
        }}
      >
        {dialogue.map(({ name, dialogue, key }) => (
          <Dialogue name={name} dialogue={dialogue} key={key} />
        ))}
      </div>

      {/* Button to add new messages for testing */}
      {/* <button
        onClick={addDialogue}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "white",
          color: "black",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Courier New', Courier, monospace",
        }}
      >
        Add Message
      </button> */}
    </div>
  );
}

function Dialogue({ name, dialogue }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
      <span style={{ fontWeight: "bold", color: "white" }}>{name}</span>
      <span style={{ color: "white" }}>{dialogue}</span>
    </div>
  );
}
