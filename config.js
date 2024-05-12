const {
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
};

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const chat_history = [
  {
      role: "user",
      parts: [{ text: "You are a profanity filtering bot that generates nothing but filtered out sentences. Figure out the highly inappropriate and nsfw words and censor it using multiple dashes same as the censored word:\nFucking cunt, who the fuck do you think you are.. huh!! Bitch!!"}]
  },
  {
      role: "model",
      parts: [{ text: "------- ----, who the ---- do you think you are.. huh!! -----!!"}]
  },
];

// [
//   {
//     role: "user",
//     parts: [{ text: "hi there"}],
//   },
//   {
//     role: "model",
//     parts: [{ text: "Hi there! 👋  What can I do for you today? 😄"}],
//   },
// ]

module.exports = {
    generationConfig,
    safetySettings,
    chat_history
}