"use client";
import { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { ConfigurationContext } from "../configuration-context";
import { v4 as uuidv4 } from "uuid";
import { setWorld, simulateNext, userMessage } from "../server-functions";

const LOADING_STATES = {
  waitingForYourResponse: "Waiting for your response...",
  charactersAreTyping: "Characters are typing...",
};

export default function Home() {
  const { configuration, setConfiguration } = useContext(ConfigurationContext);
  const [userInput, setUserInput] = useState("");
  const [dialogue, setDialogue] = useState([]);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.notLoading);

  const intervalRef = useRef(null);
  const dialogueRef = useRef(null);

  useEffect(() => {
    (async () => {
      await setWorld(configuration);
    })();
  }, [configuration]);

  const startPolling = () => {
    setLoadingState(LOADING_STATES.charactersAreTyping);
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      const resData = await simulateNext();
      if (resData && resData.character && resData.new_observation) {
        setDialogue((prevDialogue) => [
          ...prevDialogue,
          {
            name: resData.character,
            dialogue: resData.new_observation.message,
            key: uuidv4(),
          },
        ]);
      }
    }, 10000);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, []);

  // Auto-scroll to the bottom when new dialogue appears
  useEffect(() => {
    if (dialogueRef.current) {
      dialogueRef.current.scrollTop = dialogueRef.current.scrollHeight;
    }
  }, [dialogue]);

  // Handle user input submission
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const chosenCharacter = configuration.characterConfiguration.find(
      (char) => char.key === configuration.userCharacter
    );

    if (!chosenCharacter) {
      console.error("Error: Selected character not found!");
      return;
    }

    // Show the user's message in the dialogue
    setDialogue((prevDialogue) => [
      ...prevDialogue,
      { name: chosenCharacter.name, dialogue: userInput, key: uuidv4() },
    ]);

    // Send the message to the backend
    await userMessage({
      user_character: chosenCharacter.name,
      message: userInput,
    });

    setUserInput("");
    startPolling();
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
        <LoadingText loadingTextValue={loadingState} />
      </div>

      {/* Show input box only if userCharacter is selected */}
      {configuration.userCharacter && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <textarea
            value={userInput}
            onFocus={() => {
              stopPolling();
              setLoadingState(LOADING_STATES.waitingForYourResponse);
            }}
            onBlur={() => {
              startPolling();
            }}
            onChange={(e) => {
              setUserInput(e.target.value);
              stopPolling();
              setLoadingState(LOADING_STATES.waitingForYourResponse);
            }}
            placeholder="Type your message..."
            style={{
              backgroundColor: "black",
              color: "white",
              borderWidth: "1px",
              borderColor: "white",
              borderRadius: "5px",
              padding: "10px",
              width: "500px",
              height: "60px",
              fontFamily: "'Courier New', Courier, monospace",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "white",
              color: "black",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            Send
          </button>
        </div>
      )}
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

function LoadingText({ loadingTextValue }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
      <span style={{ fontWeight: "bold", color: "white" }}>{loadingTextValue}</span>
    </div>
  );
}
