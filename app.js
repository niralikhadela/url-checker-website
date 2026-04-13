const input = document.getElementById('url-input');
const status = document.getElementById('status-message');
let currentUrl = "";
let timeoutId = null;

// Validate URL format
function validUrl(url) {
  const URL_FORMAT_REGEX = /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/;
  return URL_FORMAT_REGEX.test(url);
}

// Simulated async server request (now returns a Promise)
function fakeServer(url) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      var result;
      if (url.indexOf("notfound") != -1) {
        result = { ok: false };
      } else if (url.charAt(url.length - 1) == "/") {
        result = { ok: true, kind: "folder" };
      } else {
        result = { ok: true, kind: "file" };
      }
      resolve(result);
    }, 800);
  });
}

// Actual logic to check URL
function checkUrl(url) {
  currentUrl = url;
  if (!validUrl(url)) {
    setStatus("Invalid URL format", "error");
    return;
  }

  setStatus("Checking...", "loading");

  fakeServer(url).then(function (res) {
    // Ignore results if user changed the input while waiting
    if (url !== currentUrl) return;

    if (!res.ok) {
      setStatus("URL not found", "error");
    } else {
      setStatus("URL exists and is a " + res.kind, "success");
    }
  });
}

// Input handler (runs on every keystroke)
input.oninput = function () {
  const url = input.value.trim();

  if (url === "") {
    setStatus("", "");
    currentUrl = "";
    return;
  }

  checkUrl(url);
};

// Update message on page
function setStatus(message, type) {
  status.textContent = message;
  status.className = "status " + type;
}
