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
    const newTextArray = textArray.map((oldVal) => {
      if (oldVal.key == key) {
        return { ...oldVal, name: newName };
      } else {
        return oldVal;
      }
    });
    setTextArray(newTextArray);
  };
  const handleDescriptionChange = (newDescription, key) => {
    const newTextArray = textArray.map((oldVal) => {
      if (oldVal.key == key) {
        return { ...oldVal, description: newDescription };
      } else {
        return oldVal;
      }
    });
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
      }}
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
    >
      <div
        style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}
        className="font-[family-name:var(--font-geist-sans)]"
      >
        <span>configure characters</span>
        <div
          className="overflow-x-auto"
          style={{ height: 330, width: 600, flexDirection: "row", display: "flex", justifyContent: "flex-start" }}
        >
          {textArray.map((val) => {
            return (
              <CharacterInput
                name={val.name}
                description={val.description}
                characterKey={val.key}
                key={val.key}
                handleNameChange={handleNameChange}
                handleDescriptionChange={handleDescriptionChange}
              />
            );
          })}
          <button onClick={() => createNewCharacter()}>
            <Plus />
          </button>
        </div>
      </div>
      <Link
        href="/story"
        style={{ fontWeight: "bold" }}
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
          borderWidth: 1,
          borderColor: "white",
          padding: 10,
          width: 500,
          marginTop: 20,
        }}
      />
      <textarea
        value={description}
        onChange={(e) => handleDescriptionChange(e.target.value, characterKey)}
        placeholder="Enter character description..."
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
  );
}
