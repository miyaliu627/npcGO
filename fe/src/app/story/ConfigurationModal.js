import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useContext } from "react";
import { ConfigurationContext } from "../configuration-context";
import CharacterConfigurationSection from "./CharacterConfigurationSection";

export default function ConfigurationModal() {
  // UI State
  let [isOpen, setIsOpen] = useState(true);

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
  const chosenCharacter = configuration.characterConfiguration.find((char) => char.key === configuration.userCharacter);
  const [selectedCharacter, setSelectedCharacter] = useState(chosenCharacter);

  return (
    <>
      <Button
        onClick={open}
        className="rounded-md bg-black/20 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        Edit World Configuration
      </Button>

      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-white"
                style={{ fontFamily: "'Courier New', Courier, monospace" }}
              >
                Edit Configuration
              </DialogTitle>
              <span>ConfigurationContext configuration: {JSON.stringify(configuration)}</span>
              <WorldInput worldText={worldText} setWorldText={setWorldText} />
              <CharacterConfigurationSection
                textArray={characterArray}
                setTextArray={setCharacterArray}
                selectedCharacter={selectedCharacter}
                setSelectedCharacter={setSelectedCharacter}
              />
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={close}
                >
                  Got it, thanks!
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
    <>
      <span>Configure World Setting</span>
      <textarea
        value={worldText}
        onChange={(e) => setWorldText(e.target.value)}
        placeholder="Enter world description..."
        style={{
          backgroundColor: "black",
          color: "white",
          borderWidth: "1px",
          borderColor: "white",
          borderRadius: "5px",
          padding: "10px",
          height: "200px",
          width: "500px",
          marginTop: "20px",
          marginBottom: "20px",
          fontFamily: "'Courier New', Courier, monospace",
        }}
      />
    </>
  );
}
