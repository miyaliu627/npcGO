"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import Plus from "../_graphics/Plus";
import { ConfigurationContext } from "../configuration-context";

export default function Home() {
  const [textArray, setTextArray] = useState([{ name: "", description: "", key: uuidv4() }]);
  const { configuration, setConfiguration } = useContext(ConfigurationContext);

  const handleNameChange = (newName, key) => {
    const newTextArray = textArray.map((oldVal) =>
      oldVal.key === key ? { ...oldVal, name: newName } : oldVal
    );
    setTextArray(newTextArray);
  };

  const handleDescriptionChange = (newDescription, key) => {
    const newTextArray = textArray.map((oldVal) =>
      oldVal.key === key ? { ...oldVal, description: newDescription } : oldVal
    );
    setTextArray(newTextArray);
  };

  const createNewCharacter = () => {
    setTextArray([...textArray, { name: "", description: "", key: uuidv4() }]);
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
      }}
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20"
    >
      <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
        <span>configure characters</span>
        <div
          className="overflow-x-auto"
          style={{
            height: 330,
            width: 600,
            flexDirection: "row",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {textArray.map((val) => (
            <CharacterInput
              name={val.name}
              description={val.description}
              characterKey={val.key}
              key={val.key}
              handleNameChange={handleNameChange}
              handleDescriptionChange={handleDescriptionChange}
            />
          ))}
          <button onClick={createNewCharacter}>
            <Plus />
          </button>
        </div>
      </div>
      <Link
        href="/story"
        style={{
          fontWeight: "bold",
          color: "white",
          textDecoration: "underline",
        }}
        onClick={() => setConfiguration({ ...configuration, characterConfiguration: textArray })}
      >
        next
      </Link>
    </div>
  );
}

function CharacterInput({ name, description, characterKey, handleNameChange, handleDescriptionChange }) {
  return (
    <div style={{ marginRight: 20 }}>
      <textarea
        value={name}
        onChange={(e) => handleNameChange(e.target.value, characterKey)}
        placeholder="Enter character name..."
        style={{
          backgroundColor: "black",
          color: "white",
          borderWidth: "1px",
          borderColor: "white",
          borderRadius: "10px",
          padding: "10px",
          width: "500px",
          height: "45px",
          marginTop: "20px",
          fontFamily: "'Courier New', Courier, monospace",
        }}
      />
      <textarea
        value={description}
        onChange={(e) => handleDescriptionChange(e.target.value, characterKey)}
        placeholder="Enter character description..."
        style={{
          backgroundColor: "black",
          color: "white",
          borderWidth: "1px",
          borderColor: "white",
          borderRadius: "10px",
          padding: "10px",
          height: "200px",
          width: "500px",
          marginTop: "20px",
          marginBottom: "20px",
          fontFamily: "'Courier New', Courier, monospace",
        }}
      />
    </div>
  );
}
