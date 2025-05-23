"use server";

// @app.route('/set_world', methods=['POST'])
// @app.route('/simulate_next', methods=['GET'])
// @app.route('/user_message', methods=['POST'])
const BASE_URL = "http://127.0.0.1:5001";
const SET_WORLD_URL = BASE_URL + "/set_world";
const UPDATE_WORLD_URL = BASE_URL + "/update_world";
const UPDATE_CHARACTERS_URL = BASE_URL + "/update_characters";
const SIMULATE_NEXT_URL = BASE_URL + "/simulate_next";
const USER_MESSAGE_URL = BASE_URL + "/user_message";

const transformConfigurationToPayloadFormat = (config) => {
  const chosenCharacter = config.characterConfiguration.find((char) => char.key === config.userCharacter);

  return {
    world_setting: config.worldConfiguration,
    characters_json: {
      characters: config.characterConfiguration.reduce((acc, val) => {
        acc[val.name] = { name: val.name, description: val.description };
        return acc;
      }, {}),
    },
    user_character: chosenCharacter ? chosenCharacter.name : null,
  };
};

export async function setWorld(configurationData) {
  try {
    const transformedData = transformConfigurationToPayloadFormat(configurationData);
    console.log("Sending to /set_world:", JSON.stringify(transformedData, null, 2));

    const res = await fetch(SET_WORLD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    });

    if (!res.ok) throw new Error(`Failed to set world: ${res.statusText}`);

    return await res.json();
  } catch (error) {
    console.error("Error in setWorld:", error);
    return { error: error.message };
  }
}

export async function updateWorld(configurationData) {
  try {
    const transformedData = transformConfigurationToPayloadFormat(configurationData);
    const finalPayload = { new_world_setting: transformedData.world_setting };
    console.log("Sending to /update_world:", JSON.stringify(finalPayload, null, 2));

    const res = await fetch(UPDATE_WORLD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalPayload),
    });

    if (!res.ok) throw new Error(`Failed to update world: ${res.statusText}`);

    return await res.json();
  } catch (error) {
    console.error("Error in updateWorld:", error);
    return { error: error.message };
  }
}

export async function updateCharacters(configurationData) {
  try {
    const transformedData = transformConfigurationToPayloadFormat(configurationData);
    const finalPayload = { characters_json: transformedData.characters_json };
    console.log("Sending to /update_characters:", JSON.stringify(finalPayload, null, 2));

    const res = await fetch(UPDATE_CHARACTERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalPayload),
    });

    if (!res.ok) throw new Error(`Failed to update characters: ${res.statusText}`);

    return await res.json();
  } catch (error) {
    console.error("Error in updateCharacters:", error);
    return { error: error.message };
  }
}

export async function simulateNext() {
  try {
    const res = await fetch(SIMULATE_NEXT_URL, {
      method: "GET",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to simulate next step: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in simulateNext:", error.message);
    return { error: error.message };
  }
}

export async function userMessage(messageData) {
  try {
    const res = await fetch(USER_MESSAGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to send user message: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in sending user message:", error.message);
    return { error: error.message };
  }
}
