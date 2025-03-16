import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useContext, useEffect } from "react";
import { ConfigurationContext } from "../configuration-context";
import CharacterConfigurationSection from "./CharacterConfigurationSection";
import { updateCharacters, updateWorld } from "../server-functions";

export default function ConfigurationModal() {
  // UI State
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  // Configuration State
  const { configuration, setConfiguration } = useContext(ConfigurationContext);
  const [worldText, setWorldText] = useState(configuration.worldConfiguration);
  const [characterArray, setCharacterArray] = useState(configuration.characterConfiguration);
  const [selectedCharacter, setSelectedCharacter] = useState(configuration.userCharacter);

  // Reset state if user closes the modal without pressing submit
  function resetStateAndClose() {
    setWorldText(configuration.worldConfiguration);
    setCharacterArray(configuration.characterConfiguration);
    setSelectedCharacter(configuration.userCharacter);
    close();
  }

  // Submit
  function submitData() {
    const newConfigurationObject = {
      worldConfiguration: worldText,
      characterConfiguration: characterArray,
      userCharacter: selectedCharacter,
    };
    setConfiguration(newConfigurationObject);
    updateWorld(newConfigurationObject);
    updateCharacters(newConfigurationObject);
    close();
  }

  return (
    <>
      <Button
        onClick={open}
        className="rounded-md bg-black/20 py-2 px-4 text-md font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        Edit Configurations
      </Button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={resetStateAndClose}
        __demoMode
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="rounded-xl backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            style={{
              backgroundColor: "white",
              width: "40vw", 
              maxWidth: "900px", // Prevent it from getting too wide
              height: "60vh", // 3/5 of the screen height
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              padding: "30px", // Increase padding for better spacing
              overflowY: "auto",
              borderRadius: "12px",
            }}
          >
            <DialogTitle
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                color: "black",
                fontSize: "36px",
                marginBottom: "10px",
              }}
            >
              edit configuration
            </DialogTitle>

            <DialogTitle
              as="h3"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                color: "black",
                fontSize: "20px",
                marginBottom: "10px",
              }}
            >
              world description
            </DialogTitle>

            <WorldInput worldText={worldText} setWorldText={setWorldText} />

            <DialogTitle
              as="h3"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                color: "black",
                fontSize: "20px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              configure characters
            </DialogTitle>

            {/* Wrapping Character Configuration in a Flexbox */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <CharacterConfigurationSection
                textArray={characterArray}
                setTextArray={setCharacterArray}
                selectedCharacter={selectedCharacter}
                setSelectedCharacter={setSelectedCharacter}
              />
            </div>

            {/* Save Button with Margin */}
            <div className="mt-4" style={{ marginTop: "20px"}}>
              <Button
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  color: "black",
                  fontSize: "16px",
                  borderColor: "black",
                  borderWidth: "1px",
                  padding: "10px 15px",
                  borderRadius: "10px",
                }}
                onClick={submitData}
              >
                Save
              </Button>
            </div>
          </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

function WorldInput({ worldText, setWorldText }) {
  return (
    <textarea
      value={worldText}
      onChange={(e) => setWorldText(e.target.value)}
      placeholder="Enter world description..."
      style={{
        backgroundColor: "white",
        color: "black",
        borderWidth: "1px",
        borderColor: "black",
        borderRadius: "5px",
        padding: "10px",
        minHeight: "200px", // Ensures the box does not shrink
        width: "100%", // Ensures full width
        resize: "none", // Prevents user resizing from overriding the set height
        marginTop: "10px",
        marginBottom: "20px",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    />
  );
}

