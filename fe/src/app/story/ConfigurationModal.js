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
        Edit World Configuration
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
              // className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
              className="rounded-xl backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
              style={{
                backgroundColor: "white",
                width: 620,
                paddingLeft: 20,
                paddingTop: 20,
                paddingBottom: 20,
                paddingRight: 0,
              }}
            >
              {/* <span style={{ color: "black" }}>state</span>
              <br></br>
              <br></br>
              <span style={{ color: "black" }}>configuration context {JSON.stringify(configuration)}</span>
              <br></br>
              <br></br>

              <span style={{ color: "black" }}>worldText {JSON.stringify(worldText)}</span>
              <br></br>
              <br></br>
              <span style={{ color: "black" }}>characterArray {JSON.stringify(characterArray)}</span>
              <br></br>
              <br></br>
              <span style={{ color: "black" }}>selectedCharacter {JSON.stringify(selectedCharacter)}</span>
              <br></br>
              <br></br> */}

              <DialogTitle style={{ fontFamily: "'Courier New', Courier, monospace", color: "black", fontSize: 36 }}>
                edit configuration
              </DialogTitle>
              {/* <span>ConfigurationContext configuration: {JSON.stringify(configuration)}</span> */}
              <DialogTitle as="h3" style={{ fontFamily: "'Courier New', Courier, monospace", color: "black" }}>
                world description
              </DialogTitle>
              <WorldInput worldText={worldText} setWorldText={setWorldText} />
              <CharacterConfigurationSection
                textArray={characterArray}
                setTextArray={setCharacterArray}
                selectedCharacter={selectedCharacter}
                setSelectedCharacter={setSelectedCharacter}
              />
              <div className="mt-4">
                <Button
                  style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    color: "black",
                    fontSize: 16,
                    borderColor: "black",
                    borderWidth: 1,
                    padding: 5,
                    borderRadius: 10,
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
        height: "200px",
        width: "500px",
        marginTop: "20px",
        marginBottom: "20px",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    />
  );
}
