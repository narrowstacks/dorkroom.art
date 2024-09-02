const modes = ["light", "dark", "darkroom", "high-contrast"];
const modeIcons = {
	light: "🌙",
	dark: "🌞",
	darkroom: "🟥",
	"high-contrast": "✒️",
};

function getLocalStorage(key) {
	return localStorage.getItem(key);
}

function setLocalStorage(key, value) {
	localStorage.setItem(key, value);
}

function initializeMode() {
	const savedMode = getLocalStorage("mode") || "light";
	document.documentElement.classList.add(`${savedMode}-mode`);
	return savedMode;
}

function updateMode(mode) {
	document.documentElement.classList.remove(...modes.map((m) => `${m}-mode`));
	document.body.classList.remove(...modes.map((m) => `${m}-mode`));
	document.documentElement.classList.add(`${mode}-mode`);
	document.body.classList.add(`${mode}-mode`);
	setLocalStorage("mode", mode);

	const modeToggle = document.getElementById("mode-toggle");
	modeToggle.textContent = modeIcons[mode];

	const githubLogo = document.querySelector(".github-logo");
	githubLogo.src =
		mode === "dark" || mode === "darkroom"
			? "media/github-mark.png"
			: "media/github-mark-white.png";
}

document.addEventListener("DOMContentLoaded", () => {
	const initialMode = initializeMode();
	document.body.classList.add(`${initialMode}-mode`);

	const toggleContainer = document.createElement("div");
	toggleContainer.id = "toggle-container";
	const modeToggle = document.createElement("button");
	modeToggle.id = "mode-toggle";
	modeToggle.title = "toggle color mode";
	toggleContainer.appendChild(modeToggle);
	document.body.insertBefore(toggleContainer, document.body.firstChild);

	let currentModeIndex = modes.indexOf(initialMode);

	modeToggle.addEventListener("click", () => {
		currentModeIndex = (currentModeIndex + 1) % modes.length;
		updateMode(modes[currentModeIndex]);
	});

	updateMode(initialMode);
});
