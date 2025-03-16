"use client";
import { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { ConfigurationContext } from "../configuration-context";
import { v4 as uuidv4 } from "uuid";
import { setWorld, simulateNext, userMessage } from "../server-functions";
import ConfigurationModal from "./ConfigurationModal";

const LOADING_STATES = {
  waitingForYourResponse: "Waiting for your response.",
  charactersAreTyping: "A character is typing.",
};

const GENERATE_STORY_IMAGE_URL = "http://127.0.0.1:5001/generate_story_image"; 

export default function Home() {
  const { configuration, setConfiguration } = useContext(ConfigurationContext);
  const [userInput, setUserInput] = useState("");
  const [dialogue, setDialogue] = useState([]);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.notLoading);
  const [simulateCount, setSimulateCount] = useState(0); // Track requests to simulateNext

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
      await fetchNextDialogue();
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

  const fetchNextDialogue = async () => {
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

      if (resData.new_reflection) {
        setDialogue((prevDialogue) => [
          ...prevDialogue,
          {
            reflection: resData.new_reflection.content, // Reflection entry
            key: uuidv4(),
          },
        ]);
      }
  
      // If the response includes an image URL, add it to the conversation
      if (resData.image_url) {
        setDialogue((prevDialogue) => [
          ...prevDialogue,
          { imageUrl: resData.image_url, key: uuidv4() },
        ]);
      }
    }
  };

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
        {dialogue.map((msg) => {
          const { key, ...rest } = msg;
          return <Dialogue key={key} {...rest} />;
        })}
        <LoadingText loadingTextValue={loadingState} />
      </div>

      {/* Show input box only if userCharacter is selected */}
      {configuration.userCharacter && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
              height: "44px",
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
              marginLeft: "10px",
              padding: "10px 20px",
              backgroundColor: "white",
              color: "black",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Courier New', Courier, monospace",
              borderRadius: "5px",
            }}
          >
            Send
          </button>
        </div>
      )}
      <div style={{ height: "10px" }}></div>
      <ConfigurationModal />
    </div>
  );
}

function Dialogue({ name, dialogue, imageUrl, reflection }) {
  if (reflection) {
    return (
      <div
        style={{
          textAlign: "center",
          fontStyle: "italic",
          color: "lightgray",
          width: "33%",
          margin: "10px auto",
          padding: "10px",
        }}
      >
        {reflection}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
      {name && <span style={{ fontWeight: "bold", color: "white" }}>{name}</span>}
      {dialogue && <span style={{ color: "white" }}>{dialogue}</span>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated Story Image"
          style={{ maxWidth: "100%", borderRadius: "10px", marginTop: "10px" }}
        />
      )}
    </div>
  );
}

function LoadingText({ loadingTextValue }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
      <span
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          background: "linear-gradient(90deg, #d3d3d3, #000000, #d3d3d3)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradientAnimation 8s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {loadingTextValue}
        <span className="dots"></span>
      </span>
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes typingDots {
            0% { content: ''; }
            33% { content: '.'; }
            66% { content: '..'; }
            100% { content: '...'; }
          }

          .dots::after {
            display: inline-block;
            content: "";
            animation: typingDots 1.5s infinite steps(1);
          }
        `}
      </style>
    </div>
  );
}
