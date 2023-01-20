const insert = (content) => {
  // let re = /^Am Al editable LW-avf/;
  const elements = document.getElementsByClassName(
    "Am Al editable LW-avf tS-tW"
  );

  if (elements.length === 0) {
    return;
  }

  const element = elements[0];

  const splitContent = content.split("\n");

  if (splitContent.length === 1) {
    element.textContent = "generating...";
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "inject") {
    const { content } = request;

    const result = insert(content);

    if (!result) {
      sendResponse({ status: "failed" });
    }

    sendResponse({ status: "success" });
  }
});
