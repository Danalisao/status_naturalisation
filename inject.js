function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}

// Détection du navigateur et utilisation de l'API appropriée
const runtime = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;

// Inject local CryptoJS library
injectScript(runtime.getURL("crypto-js.min.js"), "body");
injectScript(runtime.getURL("forge.min.js"), "body");

// Inject content.js
injectScript(runtime.getURL("content.js"), "body");
