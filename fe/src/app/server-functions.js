"use server";

// @app.route('/set_world', methods=['POST'])
// @app.route('/simulate_next', methods=['GET'])
// @app.route('/user_message', methods=['POST'])
const BASE_URL = "http://127.0.0.1:5000";
const SET_WORLD_URL = BASE_URL + "/set_world";
const SIMULATE_NEXT_URL = BASE_URL + "/simulate_next";
const USER_MESSAGE_URL = BASE_URL + "/user_message";

const transformConfigurationToPayloadFormat = (config) => {
  const characterSetting = {};
  config.characterConfiguration.map((val) => {
    characterSetting[val.name] = { name: val.name, description: val.description };
  });
  return { world_setting: config.worldConfiguration, characters_json: characterSetting };
};

export async function setWorld(configurationData) {
  const transformedData = transformConfigurationToPayloadFormat(configurationData);
  const res = await fetch(SET_WORLD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transformedData),
  });

  if (!res.ok) {
    throw new Error(`Failed to set world: ${res.statusText}`);
  }

  return await res.json();
}

export async function simulateNext() {
  const res = await fetch(SIMULATE_NEXT_URL, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to simulate next step: ${res.statusText}`);
  }

  return await res.json();
}

export async function userMessage(messageData) {
  const res = await fetch(USER_MESSAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });

  if (!res.ok) {
    throw new Error(`Failed to send user message: ${res.statusText}`);
  }

  return await res.json();
}
