const closeButton = document.getElementById("closeButton");

closeButton.addEventListener("click", () => window.electronAPI.closeAboutWindow())