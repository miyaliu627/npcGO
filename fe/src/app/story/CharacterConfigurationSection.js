"use client";
import { useState, useContext, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Plus from "../_graphics/Plus";

export default function CharacterConfigurationSection({
  textArray,
  setTextArray,
  selectedCharacter,
  setSelectedCharacter,
}) {
  const containerRef = useRef(null);
  const lastCharacterRef = useRef(null);

  useEffect(() => {
    if (lastCharacterRef.current) {
      lastCharacterRef.current.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [textArray]);

  const handleNameChange = (newName, key) => {
    const newTextArray = textArray.map((oldVal) => (oldVal.key === key ? { ...oldVal, name: newName } : oldVal));
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

  const handleSelection = (key) => {
    setSelectedCharacter((prevSelected) => (prevSelected === key ? null : key));
  };

  return (
    <div style={{}}>
      <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
        <span style={{ fontFamily: "'Courier New', Courier, monospace", color: "black" }}>configure characters</span>
        <div
          ref={containerRef}
          className="overflow-x-auto"
          style={{
            height: 350,
            width: 600,
            flexDirection: "row",
            display: "flex",
            justifyContent: "flex-start",
            overflowX: "auto",
            scrollBehavior: "smooth",
            whiteSpace: "nowrap",
          }}
        >
          {textArray.map((val, index) => (
            <div
              key={val.key}
              ref={index === textArray.length - 1 ? lastCharacterRef : null}
              style={{ display: "inline-block" }}
            >
              <CharacterInput
                name={val.name}
                description={val.description}
                characterKey={val.key}
                handleNameChange={handleNameChange}
                handleDescriptionChange={handleDescriptionChange}
                isSelected={selectedCharacter === val.key}
                onSelect={() => handleSelection(val.key)}
              />
            </div>
          ))}
          <button onClick={createNewCharacter}>
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}

function CharacterInput({
  name,
  description,
  characterKey,
  handleNameChange,
  handleDescriptionChange,
  isSelected,
  onSelect,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginRight: "20px",
      }}
    >
      <textarea
        value={name}
        onChange={(e) => handleNameChange(e.target.value, characterKey)}
        placeholder="Enter character name..."
        style={{
          backgroundColor: "white",
          color: "black",
          borderWidth: "1px",
          borderColor: "black",
          borderRadius: "5px",
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
          backgroundColor: "white",
          color: "black",
          borderWidth: "1px",
          borderColor: "black",
          borderRadius: "5px",
          padding: "10px",
          height: "200px",
          width: "500px",
          marginTop: "10px",
          marginBottom: "20px",
          fontFamily: "'Courier New', Courier, monospace",
        }}
      />
      <button
        onClick={onSelect}
        style={{
          backgroundColor: isSelected ? "green" : "gray",
          color: "white",
          borderRadius: "20px",
          padding: "5px 10px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        {isSelected ? "This is me!" : "Select as me"}
      </button>
    </div>
  );
}
