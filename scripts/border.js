document.addEventListener("DOMContentLoaded", initializeApp);

let previewOrientation = "horizontal";
const storedOffsets = { horizontal: 0, vertical: 0 };
let offsetsInitialized = false;

const aspectRatios = {
	"3/2": { label: "35mm standard frame, 6x9 (2x3)", ratio: 3 / 2 },
	"65/24": { label: "XPan Pano (65x24)", ratio: 65 / 24 },
	"6/4.5": { label: "6x4.5", ratio: 6 / 4.5 },
	"1/1": { label: "Square/6x6", ratio: 1 },
	"7/6": { label: "6x7", ratio: 7 / 6 },
	"8/6": { label: "6x8", ratio: 8 / 6 },
	"5/4": { label: "4x5", ratio: 5 / 4 },
	"7/5": { label: "5x7", ratio: 7 / 5 },
	"4/3": { label: "4x3", ratio: 4 / 3 },
	Custom: { label: "Custom", ratio: null },
};

const paperSizes = {
	"4x5": { label: "4x5", dimensions: [5, 4] },
	"4x6": { label: "4x6 (postcard)", dimensions: [6, 4] },
	"5x7": { label: "5x7", dimensions: [7, 5] },
	"8x10": { label: "8x10", dimensions: [10, 8] },
	"11x14": { label: "11x14", dimensions: [14, 11] },
	"16x20": { label: "16x20", dimensions: [20, 16] },
	"20x24": { label: "20x24", dimensions: [24, 20] },
	Custom: { label: "Custom", dimensions: [null, null] },
};

const dom = {
	aspectRatioSelect: null,
	paperSizeSelect: null,
	paperWidthInput: null,
	paperHeightInput: null,
	customDimensions: null,
	customAspectRatio: null,
	customAspectWidth: null,
	customAspectHeight: null,
	minBorderInput: null,
	enableOffsetCheckbox: null,
	offsetInputs: null,
	horizontalOffsetInput: null,
	verticalOffsetInput: null,
	resultDisplay: null,
	previewContainer: null,
	paperPreview: null,
	printPreviewContainer: null,
	printPreview: null,
	toggleOrientationBtn: null,
	flipRatioBtn: null,
};

// Object to store last valid values
const lastValidValues = {
	paperWidth: null,
	paperHeight: null,
	minBorder: null,
	customAspectWidth: null,
	customAspectHeight: null,
	horizontalOffset: null,
	verticalOffset: null,
};

/**
 * Initialize the application.
 */
function initializeApp() {
	cacheDomElements();
	populateSelectOptions();
	setInitialValues();
	initializeLastValidValues();
	addEventListeners();
}

/**
 * Cache frequently accessed DOM elements.
 */
function cacheDomElements() {
	dom.aspectRatioSelect = document.getElementById("aspectRatio");
	dom.paperSizeSelect = document.getElementById("paperSize");
	dom.paperWidthInput = document.getElementById("paperWidth");
	dom.paperHeightInput = document.getElementById("paperHeight");
	dom.customDimensions = document.getElementById("customDimensions");
	dom.customAspectRatio = document.getElementById("customAspectRatio");
	dom.customAspectWidth = document.getElementById("customAspectWidth");
	dom.customAspectHeight = document.getElementById("customAspectHeight");
	dom.minBorderInput = document.getElementById("minBorder");
	dom.enableOffsetCheckbox = document.getElementById("enableOffset");
	dom.offsetInputs = document.getElementById("offsetInputs");
	dom.horizontalOffsetInput = document.getElementById("horizontalOffset");
	dom.verticalOffsetInput = document.getElementById("verticalOffset");
	dom.resultDisplay = document.getElementById("result");
	dom.previewContainer = document.getElementById("previewContainer");
	dom.paperPreview = document.getElementById("paperPreview");
	dom.printPreviewContainer = document.getElementById("printPreviewContainer");
	dom.printPreview = document.getElementById("printPreview");
	dom.toggleOrientationBtn = document.getElementById("toggleOrientationBtn");
	dom.flipRatioBtn = document.getElementById("flipRatioBtn");
}

/**
 * Populate select elements with options.
 */
function populateSelectOptions() {
	populateSelect(dom.aspectRatioSelect, aspectRatios);
	populateSelect(dom.paperSizeSelect, paperSizes);
}

/**
 * Helper function to populate a select element.
 * @param {HTMLSelectElement} selectElement - The select element to populate.
 * @param {Object} options - An object containing value-label pairs.
 */
function populateSelect(selectElement, options) {
	Object.entries(options).forEach(([value, details]) => {
		const option = new Option(details.label, value);
		selectElement.add(option);
	});
}

/**
 * Set initial values and states on page load.
 */
function setInitialValues() {
	dom.paperSizeSelect.selectedIndex = 3; // Default selection
	paperSize = dom.paperSizeSelect.value;
	paperDimensions = getPaperDimensions(paperSize);
	dom.paperWidthInput.value = paperDimensions[0];
	dom.paperHeightInput.value = paperDimensions[1];
	aspectRatio = getAspectRatio(dom.aspectRatioSelect.value);
	updatePaperSizeVisibility();
	updateAspectRatioVisibility(dom.aspectRatioSelect.value);
	calculateBorders();
}

/**
 * Initialize last valid values based on initial input values.
 */
function initializeLastValidValues() {
	lastValidValues.paperWidth = parseFloat(dom.paperWidthInput.value) || 0;
	lastValidValues.paperHeight = parseFloat(dom.paperHeightInput.value) || 0;
	lastValidValues.minBorder = parseFloat(dom.minBorderInput.value) || 0;
	lastValidValues.customAspectWidth =
		parseFloat(dom.customAspectWidth.value) || 0;
	lastValidValues.customAspectHeight =
		parseFloat(dom.customAspectHeight.value) || 0;
	lastValidValues.horizontalOffset =
		parseFloat(dom.horizontalOffsetInput.value) || 0;
	lastValidValues.verticalOffset =
		parseFloat(dom.verticalOffsetInput.value) || 0;
}

/**
 * Add event listeners to interactive elements.
 */
function addEventListeners() {
	const eventMap = [
		{
			element: dom.paperSizeSelect,
			event: "change",
			handler: handlePaperSizeChange,
		},
		{
			element: dom.paperWidthInput,
			event: "input",
			handler: handlePaperWidthInput,
		},
		{
			element: dom.paperHeightInput,
			event: "input",
			handler: handlePaperHeightInput,
		},
		{
			element: dom.aspectRatioSelect,
			event: "change",
			handler: handleAspectRatioChange,
		},
		{
			element: dom.customAspectWidth,
			event: "input",
			handler: handleCustomAspectWidthInput,
		},
		{
			element: dom.customAspectHeight,
			event: "input",
			handler: handleCustomAspectHeightInput,
		},
		{
			element: dom.minBorderInput,
			event: "input",
			handler: handleMinBorderInput,
		},
		{
			element: dom.enableOffsetCheckbox,
			event: "change",
			handler: toggleOffsets,
		},
		{
			element: dom.horizontalOffsetInput,
			event: "input",
			handler: handleHorizontalOffsetInput,
		},
		{
			element: dom.verticalOffsetInput,
			event: "input",
			handler: handleVerticalOffsetInput,
		},
		{
			element: dom.toggleOrientationBtn,
			event: "click",
			handler: toggleOrientation,
		},
		{
			element: dom.flipRatioBtn,
			event: "click",
			handler: flipRatio,
		},
	];

	eventMap.forEach(({ element, event, handler }) => {
		if (element) {
			element.addEventListener(event, handler);
		}
	});

	window.addEventListener("resize", calculateBorders);
}

/**
 * Handle changes in paper size selection.
 */
function handlePaperSizeChange() {
	paperSize = dom.paperSizeSelect.value;
	paperDimensions = getPaperDimensions(paperSize);
	updatePaperSizeVisibility();
	calculateBorders();
}

/**
 * Update the visibility of paper size inputs based on selection.
 */
function updatePaperSizeVisibility() {
	if (paperSize === "Custom") {
		dom.customDimensions.style.display = "flex";
		// Clear inputs when custom is selected
		dom.paperWidthInput.value = "";
		dom.paperHeightInput.value = "";
	} else {
		dom.customDimensions.style.display = "none";
		dom.paperWidthInput.value = paperDimensions[0];
		dom.paperHeightInput.value = paperDimensions[1];
		lastValidValues.paperWidth = paperDimensions[0];
		lastValidValues.paperHeight = paperDimensions[1];
	}
}

/**
 * Handle changes in aspect ratio selection.
 */
function handleAspectRatioChange() {
	const selectedRatio = dom.aspectRatioSelect.value;
	aspectRatio = getAspectRatio(selectedRatio);
	updateAspectRatioVisibility(selectedRatio);
	calculateBorders();
}

/**
 * Update the visibility of custom aspect ratio inputs.
 * @param {string} selectedRatio - The selected aspect ratio value.
 */
function updateAspectRatioVisibility(selectedRatio) {
	if (selectedRatio === "Custom") {
		dom.customAspectRatio.style.display = "flex";
		dom.customAspectWidth.value = "";
		dom.customAspectHeight.value = "";
	} else {
		dom.customAspectRatio.style.display = "none";
	}
}

/**
 * Get the numerical aspect ratio based on selection.
 * @param {string} ratioKey - The key representing the aspect ratio.
 * @returns {number|null} - The numerical aspect ratio or null for custom.
 */
function getAspectRatio(ratioKey) {
	const ratio = aspectRatios[ratioKey].ratio;
	return ratio !== null ? ratio : calculateCustomAspectRatio();
}

/**
 * Calculate the custom aspect ratio.
 * @returns {number|null} - The custom aspect ratio or null if invalid.
 */
function calculateCustomAspectRatio() {
	const width = parseFloat(dom.customAspectWidth.value);
	const height = parseFloat(dom.customAspectHeight.value);

	if (isValidDimension(width) && isValidDimension(height)) {
		return width / height;
	} else {
		// Do not display error here to prevent multiple errors during input
		return null;
	}
}

/**
 * Validate if a dimension value is a positive number.
 * @param {number} value - The value to validate.
 * @returns {boolean} - True if valid, else false.
 */
function isValidDimension(value) {
	return !isNaN(value) && value > 0;
}

/**
 * Toggle the visibility and state of offset inputs.
 */
function toggleOffsets() {
	const isEnabled = dom.enableOffsetCheckbox.checked;

	if (isEnabled) {
		initializeOffsets();
	} else {
		storeCurrentOffsets();
	}

	dom.offsetInputs.style.display = isEnabled ? "block" : "none";
	calculateBorders();
}

/**
 * Initialize offset inputs with default or stored values.
 */
function initializeOffsets() {
	if (!offsetsInitialized) {
		dom.horizontalOffsetInput.value = 0;
		dom.verticalOffsetInput.value = 0;
		offsetsInitialized = true;
	} else {
		restoreLastValidValue(dom.horizontalOffsetInput, "horizontalOffset");
		restoreLastValidValue(dom.verticalOffsetInput, "verticalOffset");
	}
}

/**
 * Store current offset values.
 */
function storeCurrentOffsets() {
	storedOffsets.horizontal = parseFloat(dom.horizontalOffsetInput.value) || 0;
	storedOffsets.vertical = parseFloat(dom.verticalOffsetInput.value) || 0;
}

/**
 * Handle input for paper width with validation.
 */
function handlePaperWidthInput() {
	const value = parseFloat(dom.paperWidthInput.value);
	if (isValidDimension(value)) {
		// Additional validation: if Custom, no upper limit, else based on paper size
		if (paperSize !== "Custom") {
			const max = getMaxPaperWidth();
			if (value > max) {
				displaySpecificError(
					"paperWidth",
					`Paper width cannot exceed ${max} inches.`,
				);
				restoreLastValidValue(dom.paperWidthInput, "paperWidth");
				return;
			}
		}
		lastValidValues.paperWidth = value;
		clearSpecificError("paperWidth");
		calculateBorders();
	} else {
		displaySpecificError(
			"paperWidth",
			"Paper width must be a positive number.",
		);
		restoreLastValidValue(dom.paperWidthInput, "paperWidth");
	}
}

/**
 * Handle input for paper height with validation.
 */
function handlePaperHeightInput() {
	const value = parseFloat(dom.paperHeightInput.value);
	if (isValidDimension(value)) {
		// Additional validation: if Custom, no upper limit, else based on paper size
		if (paperSize !== "Custom") {
			const max = getMaxPaperHeight();
			if (value > max) {
				displaySpecificError(
					"paperHeight",
					`Paper height cannot exceed ${max} inches.`,
				);
				restoreLastValidValue(dom.paperHeightInput, "paperHeight");
				return;
			}
		}
		lastValidValues.paperHeight = value;
		clearSpecificError("paperHeight");
		calculateBorders();
	} else {
		displaySpecificError(
			"paperHeight",
			"Paper height must be a positive number.",
		);
		restoreLastValidValue(dom.paperHeightInput, "paperHeight");
	}
}

/**
 * Get maximum allowed paper width based on selected paper size.
 * @returns {number} - Maximum paper width in inches.
 */
function getMaxPaperWidth() {
	// Define maximum widths for predefined paper sizes if necessary
	// For simplicity, let's assume 100 inches as an arbitrary large value
	return 100;
}

/**
 * Get maximum allowed paper height based on selected paper size.
 * @returns {number} - Maximum paper height in inches.
 */
function getMaxPaperHeight() {
	// Define maximum heights for predefined paper sizes if necessary
	// For simplicity, let's assume 100 inches as an arbitrary large value
	return 100;
}

/**
 * Handle input for custom aspect width with validation.
 */
function handleCustomAspectWidthInput() {
	const value = parseFloat(dom.customAspectWidth.value);
	if (isValidDimension(value)) {
		lastValidValues.customAspectWidth = value;
		clearSpecificError("customAspectWidth");
		aspectRatio = calculateCustomAspectRatio();
		if (aspectRatio !== null) {
			calculateBorders();
		}
	} else {
		displaySpecificError(
			"customAspectWidth",
			"Custom aspect width must be a positive number.",
		);
		restoreLastValidValue(dom.customAspectWidth, "customAspectWidth");
	}
}

/**
 * Handle input for custom aspect height with validation.
 */
function handleCustomAspectHeightInput() {
	const value = parseFloat(dom.customAspectHeight.value);
	if (isValidDimension(value)) {
		lastValidValues.customAspectHeight = value;
		clearSpecificError("customAspectHeight");
		aspectRatio = calculateCustomAspectRatio();
		if (aspectRatio !== null) {
			calculateBorders();
		}
	} else {
		displaySpecificError(
			"customAspectHeight",
			"Custom aspect height must be a positive number.",
		);
		restoreLastValidValue(dom.customAspectHeight, "customAspectHeight");
	}
}

/**
 * Handle input for minimum border with validation.
 */
function handleMinBorderInput() {
	const value = parseFloat(dom.minBorderInput.value);
	const paperWidthVal = parseFloat(dom.paperWidthInput.value);
	const paperHeightVal = parseFloat(dom.paperHeightInput.value);

	if (isValidDimension(value)) {
		if (!validateMinBorder(value, paperWidthVal, paperHeightVal)) {
			displaySpecificError(
				"minBorder",
				"Minimum border must be less than half the shortest side of the paper.",
			);
			restoreLastValidValue(dom.minBorderInput, "minBorder");
			return;
		}
		lastValidValues.minBorder = value;
		clearSpecificError("minBorder");
		calculateBorders();
	} else {
		displaySpecificError(
			"minBorder",
			"Minimum border must be a positive number.",
		);
		restoreLastValidValue(dom.minBorderInput, "minBorder");
	}
}

/**
 * Handle input for horizontal offset with validation.
 */
function handleHorizontalOffsetInput() {
	const value = parseFloat(dom.horizontalOffsetInput.value);
	if (!isNaN(value)) {
		lastValidValues.horizontalOffset = value;
		clearSpecificError("horizontalOffset");
		calculateBorders();
	} else {
		displaySpecificError(
			"horizontalOffset",
			"Horizontal offset must be a valid number.",
		);
		restoreLastValidValue(dom.horizontalOffsetInput, "horizontalOffset");
	}
}

/**
 * Handle input for vertical offset with validation.
 */
function handleVerticalOffsetInput() {
	const value = parseFloat(dom.verticalOffsetInput.value);
	if (!isNaN(value)) {
		lastValidValues.verticalOffset = value;
		clearSpecificError("verticalOffset");
		calculateBorders();
	} else {
		displaySpecificError(
			"verticalOffset",
			"Vertical offset must be a valid number.",
		);
		restoreLastValidValue(dom.verticalOffsetInput, "verticalOffset");
	}
}

/**
 * Restore the last valid value for a given input.
 * @param {HTMLElement} inputElement - The input element to restore.
 * @param {string} key - The key in lastValidValues.
 */
function restoreLastValidValue(inputElement, key) {
	if (lastValidValues[key] !== null && lastValidValues[key] !== undefined) {
		inputElement.value = lastValidValues[key];
	}
}

/**
 * Display an error message specific to an input field.
 * @param {string} field - The input field identifier.
 * @param {string} message - The error message.
 */
function displaySpecificError(field, message) {
	// Highlight the invalid input field
	const inputField = dom[field + "Input"] || dom[field];
	if (inputField) {
		inputField.classList.add("input-error");
	}

	// Append or update the error message
	const existingError = document.getElementById(`${field}-error`);
	if (existingError) {
		existingError.innerText = message;
	} else {
		const errorElement = document.createElement("div");
		errorElement.id = `${field}-error`;
		errorElement.className = "error-message";
		errorElement.innerText = message;
		inputField.parentElement.appendChild(errorElement);
	}

	// Update the general result display with error
	dom.resultDisplay.innerText = `Error: ${message}`;
}

/**
 * Clear the error message specific to an input field.
 * @param {string} field - The input field identifier.
 */
function clearSpecificError(field) {
	// Remove error highlighting from the input field
	const inputField = dom[field + "Input"] || dom[field];
	if (inputField) {
		inputField.classList.remove("input-error");
	}

	// Remove the specific error message if it exists
	const existingError = document.getElementById(`${field}-error`);
	if (existingError) {
		existingError.remove();
	}

	// If no other errors are present, clear the general result display
	if (!document.querySelector(".error-message")) {
		dom.resultDisplay.innerText = "";
	}
}

/**
 * Clear all error messages.
 */
function clearAllErrors() {
	const errorMessages = document.querySelectorAll(".error-message");
	errorMessages.forEach((error) => error.remove());

	const inputErrors = document.querySelectorAll(".input-error");
	inputErrors.forEach((input) => input.classList.remove("input-error"));

	dom.resultDisplay.innerText = "";
}

/**
 * Validate the minimum border value.
 * @param {number} minBorder - The minimum border value.
 * @param {number} paperWidth - The width of the paper.
 * @param {number} paperHeight - The height of the paper.
 * @returns {boolean} - True if valid, else false.
 */
function validateMinBorder(minBorder, paperWidth, paperHeight) {
	if (!isValidDimension(minBorder)) {
		return false;
	}

	const halfShortestSide = Math.min(paperWidth, paperHeight) / 2;
	if (minBorder >= halfShortestSide) {
		return false;
	}

	return true;
}

/**
 * Calculate and update borders based on current settings.
 */
function calculateBorders() {
	if (!aspectRatio) return;

	const paperWidthVal = parseFloat(dom.paperWidthInput.value);
	const paperHeightVal = parseFloat(dom.paperHeightInput.value);
	const minBorder = parseFloat(dom.minBorderInput.value);

	if (!validateMinBorder(minBorder, paperWidthVal, paperHeightVal)) {
		displaySpecificError(
			"minBorder",
			"Minimum border must be less than half the shortest side of the paper.",
		);
		restoreLastValidValue(dom.minBorderInput, "minBorder");
		return;
	}

	const availableWidth = paperWidthVal - 2 * minBorder;
	const availableHeight = paperHeightVal - 2 * minBorder;

	if (availableWidth <= 0 || availableHeight <= 0) {
		displaySpecificError(
			"minBorder",
			"Minimum border is too large, leaving no available space for the image.",
		);
		restoreLastValidValue(dom.minBorderInput, "minBorder");
		return;
	}

	const [imageWidth, imageHeight] = calculateImageDimensions(
		availableWidth,
		availableHeight,
		aspectRatio,
	);
	const borders = calculateBordersWithOffset(
		paperWidthVal,
		paperHeightVal,
		imageWidth,
		imageHeight,
	);

	if (borders.borderWidth === null || borders.borderHeight === null) return;

	const { borderWidth, borderHeight } = borders;
	const { horizontalOffsetInput, verticalOffsetInput } = dom;
	const horizontalOffset = parseFloat(horizontalOffsetInput.value) || 0;
	const verticalOffset = parseFloat(verticalOffsetInput.value) || 0;

	const bladePositions = calculateBladePositions(
		imageWidth,
		imageHeight,
		horizontalOffset,
		verticalOffset,
	);
	displayResult(
		bladePositions,
		imageWidth,
		imageHeight,
		borderWidth,
		borderHeight,
	);
	updatePreview(paperWidthVal, paperHeightVal, imageWidth, imageHeight);
}

/**
 * Calculate image dimensions based on available space and aspect ratio.
 * @param {number} availableWidth - Available width after borders.
 * @param {number} availableHeight - Available height after borders.
 * @param {number} ratio - Aspect ratio.
 * @returns {[number, number]} - Image width and height.
 */
function calculateImageDimensions(availableWidth, availableHeight, ratio) {
	const calculatedHeight = availableWidth / ratio;
	if (calculatedHeight <= availableHeight) {
		return [availableWidth, calculatedHeight];
	} else {
		return [availableHeight * ratio, availableHeight];
	}
}

/**
 * Calculate borders considering offsets.
 * @param {number} paperWidth - Width of the paper.
 * @param {number} paperHeight - Height of the paper.
 * @param {number} imageWidth - Width of the image.
 * @param {number} imageHeight - Height of the image.
 * @returns {Object} - Border widths and heights or null if invalid.
 */
function calculateBordersWithOffset(
	paperWidth,
	paperHeight,
	imageWidth,
	imageHeight,
) {
	let borderWidth = (paperWidth - imageWidth) / 2;
	let borderHeight = (paperHeight - imageHeight) / 2;

	if (dom.enableOffsetCheckbox.checked) {
		const horizontalOffset = parseFloat(dom.horizontalOffsetInput.value) || 0;
		const verticalOffset = parseFloat(dom.verticalOffsetInput.value) || 0;

		borderWidth -= horizontalOffset;
		borderHeight -= verticalOffset;

		const exceedsWidth =
			borderWidth + imageWidth > paperWidth || borderWidth < 0;
		const exceedsHeight =
			borderHeight + imageHeight > paperHeight || borderHeight < 0;

		if (exceedsWidth || exceedsHeight) {
			displaySpecificError(
				"horizontalOffset",
				"Offsets result in the image exceeding the paper boundaries.",
			);
			return { borderWidth: null, borderHeight: null };
		}
	}

	return { borderWidth, borderHeight };
}

/**
 * Calculate blade positions based on image size and offsets.
 * @param {number} imageWidth - Width of the image.
 * @param {number} imageHeight - Height of the image.
 * @param {number} horizontalOffset - Horizontal offset value.
 * @param {number} verticalOffset - Vertical offset value.
 * @returns {Object} - Positions of blades.
 */
function calculateBladePositions(
	imageWidth,
	imageHeight,
	horizontalOffset,
	verticalOffset,
) {
	return {
		leftBlade: imageWidth + horizontalOffset,
		rightBlade: imageWidth - horizontalOffset,
		topBlade: imageHeight - verticalOffset,
		bottomBlade: imageHeight - verticalOffset,
	};
}

/**
 * Display the calculation results to the user.
 * @param {Object} blades - Blade positions.
 * @param {number} imageWidth - Width of the image.
 * @param {number} imageHeight - Height of the image.
 * @param {number} borderWidth - Width of the border.
 * @param {number} borderHeight - Height of the border.
 */
function displayResult(
	blades,
	imageWidth,
	imageHeight,
	borderWidth,
	borderHeight,
) {
	const { resultDisplay, previewContainer } = dom;
	const { leftBlade, rightBlade, topBlade, bottomBlade } = blades;

	resultDisplay.innerText = `
	Image Dimensions: ${imageHeight.toFixed(2)} x ${imageWidth.toFixed(2)} inches
	Left Blade: ${leftBlade.toFixed(2)} inches
	Right Blade: ${rightBlade.toFixed(2)} inches
	Top Blade: ${topBlade.toFixed(2)} inches
	Bottom Blade: ${bottomBlade.toFixed(2)} inches
  `.trim();

	previewContainer.style.display = "block";
}

/**
 * Update the preview based on current settings.
 * @param {number} paperWidthVal - Width of the paper.
 * @param {number} paperHeightVal - Height of the paper.
 * @param {number} imageWidth - Width of the image.
 * @param {number} imageHeight - Height of the image.
 */
function updatePreview(paperWidthVal, paperHeightVal, imageWidth, imageHeight) {
	const { paperPreview, printPreviewContainer, printPreview } = dom;

	const [previewWidth, previewHeight] = getPreviewDimensions(
		paperWidthVal,
		paperHeightVal,
	);
	const scale = calculateScale(previewWidth, previewHeight, paperPreview);
	setPaperPreviewDimensions(paperPreview, previewWidth, previewHeight, scale);

	if (imageWidth && imageHeight) {
		updatePrintPreview(
			printPreviewContainer,
			printPreview,
			imageWidth,
			imageHeight,
			scale,
		);
	} else {
		resetPrintPreview(printPreviewContainer, printPreview);
	}
}

/**
 * Get preview dimensions based on orientation.
 * @param {number} width - Width of the paper.
 * @param {number} height - Height of the paper.
 * @returns {[number, number]} - Preview width and height.
 */
function getPreviewDimensions(width, height) {
	return previewOrientation === "vertical" ? [height, width] : [width, height];
}

/**
 * Calculate the scale for the preview.
 * @param {number} previewWidth - Width of the preview.
 * @param {number} previewHeight - Height of the preview.
 * @param {HTMLElement} paperPreview - The paper preview element.
 * @returns {number} - Calculated scale.
 */
function calculateScale(previewWidth, previewHeight, paperPreview) {
	const isMobile = window.innerWidth <= 768;
	const parent = paperPreview.parentElement;
	const maxWidth = parent.clientWidth;
	const maxHeight = isMobile ? 300 : parent.clientHeight;

	return Math.min(maxWidth / previewWidth, maxHeight / previewHeight);
}

/**
 * Set the dimensions of the paper preview.
 * @param {HTMLElement} paperPreview - The paper preview element.
 * @param {number} width - Width of the preview.
 * @param {number} height - Height of the preview.
 * @param {number} scale - Scale factor.
 */
function setPaperPreviewDimensions(paperPreview, width, height, scale) {
	paperPreview.style.width = `${width * scale}px`;
	paperPreview.style.height = `${height * scale}px`;
}

/**
 * Update the print preview based on image dimensions and scale.
 * @param {HTMLElement} container - The print preview container.
 * @param {HTMLElement} preview - The print preview element.
 * @param {number} imageWidth - Width of the image.
 * @param {number} imageHeight - Height of the image.
 * @param {number} scale - Scale factor.
 */
function updatePrintPreview(
	container,
	preview,
	imageWidth,
	imageHeight,
	scale,
) {
	const [previewWidth, previewHeight] = getPrintPreviewDimensions(
		imageWidth,
		imageHeight,
	);
	container.style.width = `${previewWidth * scale}px`;
	container.style.height = `${previewHeight * scale}px`;
	preview.style.width = "100%";
	preview.style.height = "100%";

	if (dom.enableOffsetCheckbox.checked) {
		const horizontalOffset =
			(parseFloat(dom.horizontalOffsetInput.value) || 0) * scale;
		const verticalOffset =
			(parseFloat(dom.verticalOffsetInput.value) || 0) * scale;
		container.style.transform = `translate(${horizontalOffset}px, ${verticalOffset}px)`;
	} else {
		container.style.transform = "translate(0, 0)";
	}
}

/**
 * Get print preview dimensions based on orientation.
 * @param {number} imageWidth - Width of the image.
 * @param {number} imageHeight - Height of the image.
 * @returns {[number, number]} - Print preview width and height.
 */
function getPrintPreviewDimensions(imageWidth, imageHeight) {
	return previewOrientation === "vertical"
		? [imageHeight, imageWidth]
		: [imageWidth, imageHeight];
}

/**
 * Reset the print preview to default state.
 * @param {HTMLElement} container - The print preview container.
 * @param {HTMLElement} preview - The print preview element.
 */
function resetPrintPreview(container, preview) {
	container.style.width = "0";
	container.style.height = "0";
	preview.style.width = "0";
	preview.style.height = "0";
}

/**
 * Toggle the preview orientation between horizontal and vertical.
 */
function toggleOrientation() {
	previewOrientation =
		previewOrientation === "horizontal" ? "vertical" : "horizontal";
	swapOffsets();
	calculateBorders();
}

/**
 * Swap horizontal and vertical offset values.
 */
function swapOffsets() {
	const temp = dom.horizontalOffsetInput.value;
	dom.horizontalOffsetInput.value = dom.verticalOffsetInput.value;
	dom.verticalOffsetInput.value = temp;

	// Update last valid values accordingly
	lastValidValues.horizontalOffset =
		parseFloat(dom.horizontalOffsetInput.value) || 0;
	lastValidValues.verticalOffset =
		parseFloat(dom.verticalOffsetInput.value) || 0;
}

/**
 * Flip the paper dimensions and offsets.
 */
function flipRatio() {
	flipPaperDimensions();
	swapOffsets();
	calculateBorders();
}

/**
 * Flip the paper width and height inputs.
 */
function flipPaperDimensions() {
	const tempWidth = dom.paperWidthInput.value;
	dom.paperWidthInput.value = dom.paperHeightInput.value;
	dom.paperHeightInput.value = tempWidth;

	// Update last valid values accordingly
	lastValidValues.paperWidth = parseFloat(dom.paperWidthInput.value) || 0;
	lastValidValues.paperHeight = parseFloat(dom.paperHeightInput.value) || 0;
}

/**
 * Display an error message to the user.
 * @param {string} message - The error message.
 */
function displayError(message) {
	dom.resultDisplay.innerText = `Error: ${message}`;
	// Do not hide the preview to retain last valid state
}

/**
 * Get paper dimensions based on selected size.
 * @param {string} size - Selected paper size.
 * @returns {[number, number]} - Paper width and height.
 */
function getPaperDimensions(size) {
	return paperSizes[size].dimensions;
}
