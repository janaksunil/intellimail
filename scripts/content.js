// to capture current active element
var LAST_ACTIVE_EL = null;

var ga = document.createElement("script");
ga.type = "text/javascript";
ga.async = true;
ga.src = "http://www.google-analytics.com/ga.js";
var s = document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(ga, s);

var _gaq = _gaq || [];
_gaq.push(["_setAccount", "356026393"]);

// _gaq.push(["_trackEvent", "CATEGORY", "ACTION", "LABEL"]);

// to show icon automatically
const getAllEditable = () => {
  return document.querySelectorAll("div[contenteditable=true]");
};

const typeText = (element, text) => {
  let count = 0;

  let interval = setInterval(() => {
    if (count < text.length) {
      if (text[count] == "|") {
        element.innerHTML += "<br>";
        element.innerHTML += "<br>";
        count++;
      } else {
        element.innerHTML += text[count];
        count++;
      }
    } else {
      clearInterval(interval);
    }
  }, 5);
};

const typeSubject = (element, text) => {
  let count = 0;

  let interval = setInterval(() => {
    if (count < text.length) {
      element.value += text[count];
      count++;
    } else {
      clearInterval(interval);
    }
  }, 2);
};

const insert = (content) => {
  _gaq.push(["_trackEvent", "CATEGORY", "ACTION", "LABEL"]);
  // let re = /^Am Al editable LW-avf/;
  LAST_ACTIVE_EL.focus();
  const elements = document.getElementsByClassName(
    "Am Al editable LW-avf tS-tW"
  );

  const subElements = document.getElementsByClassName("aoT");

  if (subElements.length === 0) {
    return;
  }

  if (elements.length === 0) {
    return;
  }

  const element = elements[0];

  const subElement = subElements[0];
  const splitContent = content.split("\n");

  if (splitContent.length === 1) {
    if (splitContent[0] === "Your email is being crafted by IntelliMail...") {
      element.textContent = "Your email is being crafted by IntelliMail...";
    } else if (
      splitContent[0] ===
      "TypeError: Cannot read properties of undefined (reading 'pop')"
    ) {
      element.textContent =
        "We're experiencing an API outage at the moment. Try again in some time.";
    }
  } else {
    console.log(splitContent);

    //types out the subject
    subjectline = splitContent[2].slice(9);
    subElement.value = "";
    typeSubject(subElement, subjectline);

    splitContent.splice(0, 1);
    splitContent.splice(0, 1);
    splitContent.splice(0, 1);
    splitContent.splice(0, 1);

    //formats content for typing
    for (let i = 0; i < splitContent.length; i++) {
      if (splitContent[i] == "") {
        splitContent[i] = "|";
      }
    }

    // _gaq.push(["_trackEvent", "CATEGORY", "ACTION", "LABEL"]);

    //types out the  main email text
    var joined = splitContent.join(" ");
    setTimeout(() => {
      element.textContent = "";
      typeText(element, joined);
    }, subjectline.length * 20);
  }

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

  button.addEventListener("click", () => {
    // console.log(chrome.storage.local.get("hasRegistered"));
    // if (
    //   chrome.storage.local.get("hasRegistered") === null ||
    //   chrome.storage.local.get("hasRegistered") === "undefined"
    // ) {
    //   chrome.storage.local.set({ hasRegistered: "false" });
    // }
    // chrome.storage.local.get("hasRegistered", function (result) {
    //   // console.log('Value currently is ' + result.hasRegistered);
    //   if (result.hasRegistered === "false") {
    //     alert(
    //       "You haven't signed up for IntelliMail yet! Click OK to sign up."
    //     );
    //     window.open("https://airtable.com/shrwhYNbbwUGfRlu5");
    //   } else {
    const text = LAST_ACTIVE_EL.innerText;
    if (text.length === 1) {
      LAST_ACTIVE_EL.innerText =
        "Please enter some context you would like IntelliMail to expand upon";
    } else {
      // mixpanel.track("Button clicked");
      generateEmail();
    }
  });
  // Append button to parent of input
  LAST_ACTIVE_EL.parentNode.appendChild(button);
};

const generateEmail = async () => {
  LAST_ACTIVE_EL.focus();
  setButtonLoading();
  var text = LAST_ACTIVE_EL.innerText;
  //setLoader();
  chrome.runtime.sendMessage({ text });
};

const setLoader = () => {
  const element = document.getElementsByClassName(
    "Am Al editable LW-avf tS-tW"
  )[0];

  element.contentEditable = false;

  element.innerHTML = "      ";

  const loader = document.createElement("div");
  loader.innerHTML = `
  <span class="dot"></span>
  <span class="dot"></span>
  <span class="dot"></span>`;
  loader.classList.add("loader");

  element.appendChild(loader);
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
    if (content !== "Your email is being crafted by IntelliMail...")
      setButtonLoaded();
  }
});
