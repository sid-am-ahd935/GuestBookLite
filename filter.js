require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GEMINI_API_KEY;
const {
    generationConfig,
    safetySettings,
    chat_history
} = require("./config");


const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });
// const chat = model.startChat({
//   generationConfig,
//   safetySettings,
//   history: chat_history,
// });
const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "hi there"}],
      },
      {
        role: "model",
        parts: [{ text: "Hi there! 👋  What can I do for you today? 😄"}],
      },
    ],
  });

async function filter(input) {
    input = input.trim();
    let ouput = "";
    if(input == "")
        return response;

    try {
        const result = await chat.sendMessage(
            `You are a profanity filtering bot that generates nothing but filtered out sentences. Figure out the inappropriate words and censor it using multiple dashes, same length as the censored word:\n${input}`
        );
        let response = result.response;
        output = response.text();
        output = output.replace(/(\r\n|\n|\r)/gm, ""); // removing excess line breaks
        output = output.replace(/\s+/g,' ').trim();
        // console.log(output);
    } catch (err){
        console.error(`[ERROR IN FILTER]: ${err.message}`);
        throw err;
    } finally {
        return output;
    }
}

module.exports = {
    filter
}