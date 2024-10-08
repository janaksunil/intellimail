// const sendMessage = (content) => {
//   console.log("TEST");
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const activeTab = tabs[0].id;

//     chrome.tabs.sendMessage(
//       activeTab,
//       { message: "inject", content },
//       (response) => {
//         if (response.status === "failed") {
//           console.log("injection failed.");
//         }
//       }
//     );
//   });
// };

// const generate = async (prompt) => {
//   // mixpanel.track("Generation", {
//   //   source: "Intellimail extension",
//   // });
//   // Get your API key from storage
//   const key = "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";
//   const url = "https://api.openai.com/v1/completions";

//   console.log("generating completion...");

//   // Call completions endpoint
//   const completionResponse = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${key}`,
//     },
//     body: JSON.stringify({
//       // model: "text-davinci-003",
//       model: "text-davinci-003",
//       prompt: prompt,
//       max_tokens: 1250,
//       temperature: 0.7,
//     }),
//   });

//   // Select the top choice and send back
//   const completion = await completionResponse.json();
//   return completion.choices.pop();
// };

// const generateCompletionAction = async (info) => {
//   try {
//     sendMessage("Your email is being crafted by IntelliMail...");

//     const { selectionText } = info;
//     console.log("info is:", info);
//     const basePromptPrefix = `Write an email expanding only upon the given points. Include a subject. Write in the language of the prompt. Here are the points: `;
//     const baseCompletion = await generate(
//       `${basePromptPrefix}${selectionText}`
//     );
//     console.log("output is: ", baseCompletion.text);
//     sendMessage(baseCompletion.text);
//   } catch (error) {
//     console.log(error);
//     sendMessage(error.toString());
//   }
// };

// // chrome.runtime.onInstalled.addListener(() => {
// //   chrome.contextMenus.create({
// //     id: "context-run",
// //     title: "Generate email",
// //     contexts: ["selection"],
// //   });
// // });

// // Add listener
// chrome.runtime.onInstalled.addListener(function (object) {
//   let externalUrl = "https://airtable.com/shrwhYNbbwUGfRlu5";

//   if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
//     // chrome.storage.local.set({ hasRegistered: "false" });
//     chrome.tabs.create({ url: externalUrl }, function (tab) {
//       console.log("New tab launched with intellimail signup page");
//     });
//   }
// });

// chrome.runtime.onMessage.addListener(async (request) => {
//   if (request.text != null) {
//     const info = { selectionText: request.text };
//     generateCompletionAction(info);
//   }
// });

// chrome.runtime.setUninstallURL("https://airtable.com/shrWWY1fhalsBBDz1");

const sendMessage = (content) => {
  console.log("TEST");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.tabs.sendMessage(
      activeTab,
      { message: "inject", content },
      (response) => {
        if (response.status === "failed") {
          console.log("injection failed.");
        }
      }
    );
  });
};


require('dotenv').config();

const generate = async (prompt) => {
  // Get your API key from storage
  const key = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  console.log("generating completion...");

  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  // Select the top choice and send back
  const completion = await completionResponse.json();
  return completion.choices[0].message;
};

const generateCompletionAction = async (info) => {
  try {
    sendMessage("Your email is being crafted by IntelliMail...");

    const { selectionText } = info;
    console.log("info is:", info);
    const basePromptPrefix = `You are an expert email writer. Write an email expanding only upon the given points. Include a subject. Write in the language of the prompt. Here are the points: `;
    const baseCompletion = await generate(
      `${basePromptPrefix}${selectionText}`
    );
    console.log("output is: ", baseCompletion.content);
    sendMessage(baseCompletion.content);
  } catch (error) {
    console.log(error);
    sendMessage(error.toString());
  }
};

chrome.runtime.onInstalled.addListener(function (object) {
  let externalUrl = "https://airtable.com/shrwhYNbbwUGfRlu5";

  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl }, function (tab) {
      console.log("New tab launched with intellimail signup page");
    });
  }
});

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.text != null) {
    const info = { selectionText: request.text };
    generateCompletionAction(info);
  }
});

chrome.runtime.setUninstallURL("https://airtable.com/shrWWY1fhalsBBDz1");
