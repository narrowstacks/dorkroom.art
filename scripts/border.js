let previewOrientation = "horizontal";
let storedOffsets = { horizontal: 0, vertical: 0 };
let offsetsInitialized = false;

let lastValidValues = {
	paperWidth: 8,
	paperHeight: 10,
	customAspectWidth: 4,
	customAspectHeight: 3,
	minBorder: 0.5,
	horizontalOffset: 0,
	verticalOffset: 0,
};

const aspectRatios = {
	"3/2": "35mm standard frame, 6x9 (2x3)",
	"65/24": "XPan Pano (65x24)",
	"6/4.5": "6x4.5",
	"1/1": "Square/6x6",
	"7/6": "6x7",
	"8/6": "6x8",
	"5/4": "4x5",
	"7/5": "5x7",
	"4/3": "4x3",
	Custom: "Custom",
};

const paperSizes = {
	"4x5": "4x5",
	"4x6": "4x6 (postcard)",
	"5x7": "5x7",
	"8x10": "8x10",
	"11x14": "11x14",
	"16x20": "16x20",
	"20x24": "20x24",
	Custom: "Custom",
};

function populateSelectElements() {
	const aspectRatioSelect = document.getElementById("aspectRatio");
	const paperSizeSelect = document.getElementById("paperSize");

	for (const [value, text] of Object.entries(aspectRatios)) {
		const option = new Option(text, value);
		aspectRatioSelect.add(option);
	}

	for (const [value, text] of Object.entries(paperSizes)) {
		const option = new Option(text, value);
		paperSizeSelect.add(option);
	}
}

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
	populateSelectElements();

	const aspectRatioSelect = document.getElementById("aspectRatio");

	aspectRatio = calculateAspectRatio(aspectRatioSelect.value);
	paperSize = document.getElementById("paperSize").value;
	paperDimensions = getPaperDimensions(paperSize);
	paperWidth = 0;
	paperHeight = 0;

	document.getElementById("paperSize").selectedIndex = 3;
	updatePaperSize();

	addEventListeners();
}

function addEventListeners() {
	document
		.getElementById("paperSize")
		.addEventListener("change", updatePaperSize);
	document
		.getElementById("paperWidth")
		.addEventListener("input", validateAndCalculate);
	document
		.getElementById("paperHeight")
		.addEventListener("input", validateAndCalculate);
	document
		.getElementById("aspectRatio")
		.addEventListener("change", updateAspectRatio);
	document
		.getElementById("customAspectWidth")
		.addEventListener("input", validateAndCalculate);
	document
		.getElementById("customAspectHeight")
		.addEventListener("input", validateAndCalculate);
	document
		.getElementById("minBorder")
		.addEventListener("input", validateAndCalculate);
	document
		.getElementById("enableOffset")
		.addEventListener("change", toggleOffsets);
	document
		.getElementById("horizontalOffset")
		.addEventListener("input", validateAndCalculate);
	document
		.getElementById("verticalOffset")
		.addEventListener("input", validateAndCalculate);
}

function validateAndCalculate() {
	if (validateInputs()) {
		updateLastValidValues();
		calculateBorders();
	} else {
		restoreLastValidValues();
	}
}

function validateInputs() {
	const paperWidth = parseFloat(document.getElementById("paperWidth").value);
	const paperHeight = parseFloat(document.getElementById("paperHeight").value);
	const minBorder = parseFloat(document.getElementById("minBorder").value);
	const customAspectWidth = parseFloat(
		document.getElementById("customAspectWidth").value,
	);
	const customAspectHeight = parseFloat(
		document.getElementById("customAspectHeight").value,
	);

	if (
		isNaN(paperWidth) ||
		isNaN(paperHeight) ||
		paperWidth <= 0 ||
		paperHeight <= 0
	) {
		displayError("Error: Paper dimensions must be positive numbers");
		return false;
	}

	if (
		isNaN(minBorder) ||
		minBorder < 0 ||
		minBorder >= Math.min(paperWidth, paperHeight) / 2
	) {
		displayError("Error: Invalid minimum border");
		return false;
	}

	if (document.getElementById("aspectRatio").value === "Custom") {
		if (
			isNaN(customAspectWidth) ||
			isNaN(customAspectHeight) ||
			customAspectWidth <= 0 ||
			customAspectHeight <= 0
		) {
			displayError(
				"Error: Custom aspect ratio dimensions must be positive numbers",
			);
			return false;
		}
	}

	return true;
}

function updateLastValidValues() {
	lastValidValues.paperWidth = parseFloat(
		document.getElementById("paperWidth").value,
	);
	lastValidValues.paperHeight = parseFloat(
		document.getElementById("paperHeight").value,
	);
	lastValidValues.minBorder = parseFloat(
		document.getElementById("minBorder").value,
	);
	lastValidValues.customAspectWidth = parseFloat(
		document.getElementById("customAspectWidth").value,
	);
	lastValidValues.customAspectHeight = parseFloat(
		document.getElementById("customAspectHeight").value,
	);
	lastValidValues.horizontalOffset = parseFloat(
		document.getElementById("horizontalOffset").value,
	);
	lastValidValues.verticalOffset = parseFloat(
		document.getElementById("verticalOffset").value,
	);
}

function restoreLastValidValues() {
	document.getElementById("paperWidth").value = lastValidValues.paperWidth;
	document.getElementById("paperHeight").value = lastValidValues.paperHeight;
	document.getElementById("minBorder").value = lastValidValues.minBorder;
	document.getElementById("customAspectWidth").value =
		lastValidValues.customAspectWidth;
	document.getElementById("customAspectHeight").value =
		lastValidValues.customAspectHeight;
	document.getElementById("horizontalOffset").value =
		lastValidValues.horizontalOffset;
	document.getElementById("verticalOffset").value =
		lastValidValues.verticalOffset;
}

function toggleOffsets() {
	const enableOffset = document.getElementById("enableOffset").checked;
	const offsetInputs = document.getElementById("offsetInputs");

	if (enableOffset) {
		if (!offsetsInitialized) {
			document.getElementById("horizontalOffset").value = 0;
			document.getElementById("verticalOffset").value = 0;
			offsetsInitialized = true;
		} else {
			document.getElementById("horizontalOffset").value =
				storedOffsets.horizontal;
			document.getElementById("verticalOffset").value = storedOffsets.vertical;
		}
	} else {
		storedOffsets.horizontal =
			document.getElementById("horizontalOffset").value;
		storedOffsets.vertical = document.getElementById("verticalOffset").value;
	}

	offsetInputs.style.display = enableOffset ? "block" : "none";
	calculateBorders();
}

function getPaperDimensions(paperSize) {
	const dimensions = {
		"4x5": [5, 4],
		"4x6": [6, 4],
		"5x7": [7, 5],
		"8x10": [10, 8],
		"11x14": [14, 11],
		"16x20": [20, 16],
		"20x24": [24, 20],
		Custom: [null, null],
	};
	return dimensions[paperSize];
}

function updatePaperSize() {
	const paperSize = document.getElementById("paperSize").value;
	const customDimensions = document.getElementById("customDimensions");
	const dimensions = getPaperDimensions(paperSize);

	if (paperSize === "Custom") {
		customDimensions.style.display = "flex";
		customDimensions.style.alignItems = "center";
		document
			.getElementById("paperSize")
			.parentNode.appendChild(customDimensions);
		document.getElementById("paperWidth").value = "";
		document.getElementById("paperHeight").value = "";
	} else {
		customDimensions.style.display = "none";
		document.getElementById("paperWidth").value = dimensions[0];
		document.getElementById("paperHeight").value = dimensions[1];
		calculateBorders();
	}
}

function updateAspectRatio() {
	const aspectRatioElement = document.getElementById("aspectRatio");
	const customAspectRatio = document.getElementById("customAspectRatio");

	if (aspectRatioElement.value === "Custom") {
		customAspectRatio.style.display = "flex";
		customAspectRatio.style.alignItems = "center";
		aspectRatioElement.parentNode.appendChild(customAspectRatio);
	} else {
		customAspectRatio.style.display = "none";
	}

	calculateBorders();
}

function calculateAspectRatio(aspectRatioValue) {
	if (aspectRatioValue === "Custom") {
		const customWidth = parseFloat(
			document.getElementById("customAspectWidth").value,
		);
		const customHeight = parseFloat(
			document.getElementById("customAspectHeight").value,
		);
		return customWidth / customHeight;
	}
	return eval(aspectRatioValue);
}

function displayError(message) {
	document.getElementById("result").innerText = message;
}

function calculateBorders() {
	const aspectRatioValue = document.getElementById("aspectRatio").value;
	const aspectRatio = calculateAspectRatio(aspectRatioValue);
	if (!aspectRatio) return;

	const paperWidth = parseFloat(document.getElementById("paperWidth").value);
	const paperHeight = parseFloat(document.getElementById("paperHeight").value);
	const minBorder = parseFloat(document.getElementById("minBorder").value);

	const availableWidth = paperWidth - 2 * minBorder;
	const availableHeight = paperHeight - 2 * minBorder;

	const [imageWidth, imageHeight] = calculateImageDimensions(
		availableWidth,
		availableHeight,
		aspectRatio,
	);

	let borderWidth = (paperWidth - imageWidth) / 2;
	let borderHeight = (paperHeight - imageHeight) / 2;

	const enableOffset = document.getElementById("enableOffset").checked;
	let horizontalOffset = 0;
	let verticalOffset = 0;

	if (enableOffset) {
		horizontalOffset = parseFloat(
			document.getElementById("horizontalOffset").value,
		);
		verticalOffset = parseFloat(
			document.getElementById("verticalOffset").value,
		);

		borderWidth -= horizontalOffset;
		borderHeight -= verticalOffset;

		if (
			borderWidth + imageWidth > paperWidth ||
			borderHeight + imageHeight > paperHeight ||
			borderWidth < 0 ||
			borderHeight < 0
		) {
			displayError(
				"Error: Offsets result in the image exceeding the paper boundaries",
			);
			return;
		}
	}

	const leftBlade = imageWidth + horizontalOffset;
	const rightBlade = imageWidth - horizontalOffset;
	const topBlade = imageHeight - verticalOffset;
	const bottomBlade = imageHeight + verticalOffset;

	displayResult(
		imageWidth,
		imageHeight,
		borderWidth,
		borderHeight,
		leftBlade,
		rightBlade,
		topBlade,
		bottomBlade,
	);
	updatePreview(paperWidth, paperHeight, imageWidth, imageHeight);
}

function calculateImageDimensions(
	availableWidth,
	availableHeight,
	aspectRatio,
) {
	if (availableWidth / aspectRatio <= availableHeight) {
		return [availableWidth, availableWidth / aspectRatio];
	} else {
		return [availableHeight * aspectRatio, availableHeight];
	}
}

function displayResult(
	imageWidth,
	imageHeight,
	borderWidth,
	borderHeight,
	leftBlade,
	rightBlade,
	topBlade,
	bottomBlade,
) {
	document.getElementById("result").innerText =
		`Image dimensions: ${imageHeight.toFixed(2)} x ${imageWidth.toFixed(2)} inches\n` +
		`Left blade: ${leftBlade.toFixed(2)} inches\n` +
		`Right blade: ${rightBlade.toFixed(2)} inches\n` +
		`Top blade: ${topBlade.toFixed(2)} inches\n` +
		`Bottom blade: ${bottomBlade.toFixed(2)} inches`;

	document.getElementById("previewContainer").style.display = "block";
}

function updatePreview(paperWidth, paperHeight, imageWidth, imageHeight) {
	const paperPreview = document.getElementById("paperPreview");
	const printPreviewContainer = document.getElementById(
		"printPreviewContainer",
	);
	const printPreview = document.getElementById("printPreview");

	const [previewWidth, previewHeight] =
		previewOrientation === "vertical"
			? [paperHeight, paperWidth]
			: [paperWidth, paperHeight];

	const isMobile = window.innerWidth <= 768;
	const maxWidth = isMobile
		? paperPreview.parentElement.clientWidth
		: paperPreview.parentElement.clientWidth;
	const maxHeight = isMobile ? 300 : paperPreview.parentElement.clientHeight;

	const scale = Math.min(maxWidth / previewWidth, maxHeight / previewHeight);

	paperPreview.style.width = `${previewWidth * scale}px`;
	paperPreview.style.height = `${previewHeight * scale}px`;

	if (imageWidth !== null && imageHeight !== null) {
		const [printPreviewWidth, printPreviewHeight] =
			previewOrientation === "vertical"
				? [imageHeight, imageWidth]
				: [imageWidth, imageHeight];

		printPreviewContainer.style.width = `${printPreviewWidth * scale}px`;
		printPreviewContainer.style.height = `${printPreviewHeight * scale}px`;
		printPreview.style.width = "100%";
		printPreview.style.height = "100%";

		const enableOffset = document.getElementById("enableOffset").checked;
		if (enableOffset) {
			const horizontalOffset =
				parseFloat(document.getElementById("horizontalOffset").value) * scale;
			const verticalOffset =
				parseFloat(document.getElementById("verticalOffset").value) * scale;
			printPreviewContainer.style.transform = `translate(${horizontalOffset}px, ${verticalOffset}px)`;
		} else {
			printPreviewContainer.style.transform = "translate(0, 0)";
		}
	} else {
		printPreviewContainer.style.width = "0";
		printPreviewContainer.style.height = "0";
		printPreview.style.width = "0";
		printPreview.style.height = "0";
	}
}

function toggleOrientation() {
	previewOrientation =
		previewOrientation === "horizontal" ? "vertical" : "horizontal";

	const horizontalOffset = parseFloat(
		document.getElementById("horizontalOffset").value,
	);
	const verticalOffset = parseFloat(
		document.getElementById("verticalOffset").value,
	);

	document.getElementById("horizontalOffset").value = verticalOffset;
	document.getElementById("verticalOffset").value = horizontalOffset;

	calculateBorders();
}

function flipRatio() {
	const paperWidth = document.getElementById("paperWidth").value;
	document.getElementById("paperWidth").value =
		document.getElementById("paperHeight").value;
	document.getElementById("paperHeight").value = paperWidth;

	const horizontalOffset = document.getElementById("horizontalOffset").value;
	document.getElementById("horizontalOffset").value =
		document.getElementById("verticalOffset").value;
	document.getElementById("verticalOffset").value = horizontalOffset;

	toggleOrientation();
	calculateBorders();
}

window.addEventListener("resize", calculateBorders);
