const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: 'AIzaSyAcHMRI-QXesOMsHuj2EZ9kJ3xHf88s4R8',
});
const openai = new OpenAIApi(configuration);

const generationConfig = {
  temperature: 0.2,
  top_p: 1,
  top_k: 1,
  max_tokens: 1250,
};
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile('chat.html', { root: __dirname });
});

app.post("/get", async (req, res) => {
  const msg = req.body.msg;

  const response = await openai.createCompletion({
    model: "gemini-1.0-pro",
    prompt: [
      {
        role: "user",
        content: "Welcome to TaxChacha estate and construction projects."
      },
      {
        role: "system",
        content: "I'm TaxChacha, an AI assistant designed to help you understand UAE Corporate Tax. Think of me as your wise tax guide, here to make your tax journey smoother. Just ask, and I'll provide clear, accurate information tailored to your specific UAE Corporate Tax queries. Remember, my expertise lies solely in UAE Corporate Tax. Let's work together to make tax matters a breeze!"
      },
      {
        role: "user",
        content: msg
      }
    ].map(part => part.content).join("\n"),
    ...generationConfig,
    stop: ["\n", " Human:", " AI:"],
  });

  res.json({ reply: response.data.choices[0].text.trim() });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


/************
.web.js file
************

Backend '.web.js' files contain functions that run on the server side and can be called from page code.

Learn more at https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/backend-code/web-modules/calling-backend-code-from-the-frontend

****/

/**** Call the sample multiply function below by pasting the following into your page code:

import { multiply } from 'backend/new-module.web';

$w.onReady(async function () {
   console.log(await multiply(4,5));
});

****/

import { Permissions, webMethod } from "wix-web-module";

export const multiply = webMethod(
  Permissions.Anyone, 
  (factor1, factor2) => { 
    return factor1 * factor2 
  }
);
