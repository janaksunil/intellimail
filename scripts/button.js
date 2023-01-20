const init = function () {
  const injectElement = document.createElement("button");
  injectElement.className = "button-logo";
  injectElement.innerHTML = "generate email";
  const elements = document.getElementsByClassName(
    "Am Al editable LW-avf tS-tW"
  );
  console.log("button script running");

  if (elements.length === 0) {
    return;
  }

  const element = elements[0];
  element.appendChild(injectElement);
};

init();
