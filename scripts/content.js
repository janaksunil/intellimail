// to capture current active element
var LAST_ACTIVE_EL = null;

// to show icon automatically
const getAllEditable = () => {
  return document.querySelectorAll("div[contenteditable=true]");
};

const insert = (content) => {
  // let re = /^Am Al editable LW-avf/;
  LAST_ACTIVE_EL.focus();
  const elements = document.getElementsByClassName(
    "Am Al editable LW-avf tS-tW"
  );

  if (elements.length === 0) {
    return;
  }

  const element = elements[0];

  const splitContent = content.split("\n");

  if (splitContent.length === 1) {
    // element.textContent = "generating...";
    element.textContent = "";
  } else {
    element.textContent = splitContent[2];
    splitContent.splice(2, 1);
    splitContent.splice(0, 1);
    splitContent.splice(0, 1);
    splitContent.splice(splitContent.length - 1, 1);
    splitContent.forEach((content) => {
      const p = document.createElement("div");

      if (content === "") {
        const br = document.createElement("br");
        p.appendChild(br);
      } else {
        p.textContent = content;
      }

      // Insert into HTML one at a time
      element.appendChild(p);
    });
  }

  // element.textContent = splitContent[2];
  // splitContent.splice(2, 1);
  // splitContent.splice(0, 1);
  // splitContent.splice(0, 1);
  // splitContent.splice(splitContent.length - 1, 1);

  console.log(splitContent);

  // Wrap in p tags

  // splitContent.forEach((content) => {
  // const p = document.createElement("div");

  //   if (content != "") {
  //     p.textContent = content;
  //   }
  //   element.appendChild(p);
  // });
  // const p = document.createElement("div");
  // p.className = "Am Al editable LW-avf tS-tW";
  // p.ariaLabel = "Message Body";
  // p.id = ":1br";
  // p.textContent = content;
  // element.appendChild(p);

  return true;
};

const createButton = async () => {
  // Create button
  const button = document.createElement("button");
  button.style.top = LAST_ACTIVE_EL.offsetHeight + "px";
  button.style.left = "0px";
  button.style.zIndex = 1000;
  button.id = "generate-button";
  button.classList.add("generate-button");

  // Add image inside button
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("assets/imlogo.png");
  img.style.pointerEvents = "none";
  button.appendChild(img);

  // Add onclick event
  button.addEventListener("click", () => {
    generateEmail();
  });

  // Append button to parent of input
  LAST_ACTIVE_EL.parentNode.appendChild(button);
};

const generateEmail = async () => {
  LAST_ACTIVE_EL.focus();
  setButtonLoading();
  var text = LAST_ACTIVE_EL.innerText;
  chrome.runtime.sendMessage({ text });
};

const setButtonLoading = () => {
  const button = document.getElementById("generate-button");
  button.innerHTML = "<div class='spinner'></div>";

  // Remove all classes
  button.classList.remove("generate-button-error");

  // add loading class to button
  button.classList.add("generate-button-loading");
};

const setButtonLoaded = () => {
  const button = document.getElementById("generate-button");

  // Remove all classes
  button.classList.remove("generate-button-loading");
  button.classList.remove("generate-button-error");

  // Add image inside button
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("assets/imlogo.png");
  button.innerHTML = "";
  button.appendChild(img);
};

const deleteButton = () => {
  const button = document.getElementById("generate-button");
  if (button != null) button.remove();
};

const handleClick = (e) => {
  // If element is GPT-3 button, do nothing
  if (e.target.id == "generate-button") {
    return;
  }

  // If element is in editable parent, create button
  const editableDivs = getAllEditable();
  for (const div of editableDivs) {
    if (div.contains(e.target)) {
      deleteButton();
      LAST_ACTIVE_EL = div;
      createButton();
      break;
    }
  }
};

document.body.addEventListener("click", handleClick);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "inject") {
    const { content } = request;

    const result = insert(content);

    if (!result) {
      sendResponse({ status: "failed" });
    }

    sendResponse({ status: "success" });
    if (content !== "generating...") setButtonLoaded();
  }
});
