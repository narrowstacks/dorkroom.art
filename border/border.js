let previewOrientation = 'horizontal';

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    document.getElementById('aspectRatio').selectedIndex = 0;
    document.getElementById('paperSize').selectedIndex = 3;
    updatePaperSize();

    addEventListeners();
}

function addEventListeners() {
    document.getElementById('paperSize').addEventListener('change', updatePaperSize);
    document.getElementById('paperWidth').addEventListener('input', calculateBorders);
    document.getElementById('paperHeight').addEventListener('input', calculateBorders);
    document.getElementById('aspectRatio').addEventListener('change', updateAspectRatio);
    document.getElementById('customAspectWidth').addEventListener('input', calculateBorders);
    document.getElementById('customAspectHeight').addEventListener('input', calculateBorders);
    document.getElementById('minBorder').addEventListener('input', calculateBorders);
}

function getPaperDimensions(paperSize) {
    const dimensions = {
        "4x5": [4, 5],
        "4x6": [4, 6],
        "5x7": [5, 7],
        "8x10": [8, 10],
        "11x14": [11, 14],
        "16x20": [16, 20],
        "20x24": [20, 24],
        "Custom": [null, null]
    };
    return dimensions[paperSize];
}

function updatePaperSize() {
    const paperSize = document.getElementById('paperSize').value;
    const customDimensions = document.getElementById('customDimensions');
    const dimensions = getPaperDimensions(paperSize);

    if (paperSize === "Custom") {
        customDimensions.style.display = "flex";
    } else {
        customDimensions.style.display = "none";
        document.getElementById('paperWidth').value = dimensions[0];
        document.getElementById('paperHeight').value = dimensions[1];
        calculateBorders();
    }
}

function setCustomSize() {
    document.getElementById('paperSize').value = "Custom";
    document.getElementById('customDimensions').style.display = "flex";
    calculateBorders();
}

function updateAspectRatio() { // update the aspect ratio based on the selected value
    const aspectRatio = document.getElementById('aspectRatio').value;
    const customAspectRatio = document.getElementById('customAspectRatio');
    if (aspectRatio === "Custom") {
        customAspectRatio.style.display = "flex";
    } else {
        customAspectRatio.style.display = "none";
        calculateBorders();
    }
}

function setCustomAspectRatio() { // set the aspect ratio to custom
    document.getElementById('aspectRatio').value = "Custom";
    document.getElementById('customAspectRatio').style.display = "flex";
    calculateBorders();
}

function calculateAspectRatio(aspectRatioValue) { // calculate the aspect ratio based on the selected value
    if (aspectRatioValue === "Custom") {
        const customAspectWidth = parseFloat(document.getElementById('customAspectWidth').value);
        const customAspectHeight = parseFloat(document.getElementById('customAspectHeight').value);
        if (isNaN(customAspectWidth) || isNaN(customAspectHeight) || customAspectWidth <= 0 || customAspectHeight <= 0) {
            displayError('error: custom aspect ratio dimensions must be positive numbers');
            return null;
        }
        return customAspectWidth / customAspectHeight;
    }
    return eval(aspectRatioValue);
}

function displayError(message) { // display an error message
    document.getElementById('result').innerText = message;
    document.getElementById('previewContainer').style.display = 'none';
}

function calculateBorders() {
    const aspectRatioValue = document.getElementById('aspectRatio').value;
    const aspectRatio = calculateAspectRatio(aspectRatioValue);
    if (!aspectRatio) return;

    const paperWidth = parseFloat(document.getElementById('paperWidth').value);
    const paperHeight = parseFloat(document.getElementById('paperHeight').value);
    const minBorder = parseFloat(document.getElementById('minBorder').value);

    if (isNaN(minBorder) || minBorder <= 0) {
        displayError('error: minimum border must be a positive number');
        return;
    }

    if (minBorder >= Math.min(paperWidth, paperHeight) / 2) {
        displayError('error: minimum border must be less than half the shortest side of the paper');
        return;
    }

    const availableWidth = paperWidth - 2 * minBorder;
    const availableHeight = paperHeight - 2 * minBorder;

    const [imageWidth, imageHeight] = calculateImageDimensions(availableWidth, availableHeight, aspectRatio);
    // if roundUp is true, round up the border dimensions to the next highest quarter inch
    const borderWidth = (paperWidth - imageWidth) / 2;
    const borderHeight = (paperHeight - imageHeight) / 2;

    displayResult(imageWidth, imageHeight, borderWidth, borderHeight);
    updatePreview(paperWidth, paperHeight, imageWidth, imageHeight);
}

function calculateImageDimensions(availableWidth, availableHeight, aspectRatio) { // calculate the dimensions of the image and the borders
    if (availableWidth / aspectRatio <= availableHeight) {
        return [availableWidth, availableWidth / aspectRatio];
    } else {
        return [availableHeight * aspectRatio, availableHeight];
    }
}

function displayResult(imageWidth, imageHeight, borderWidth, borderHeight) {
    document.getElementById('result').innerText = `image dimensions: ${imageWidth.toFixed(2)} x ${imageHeight.toFixed(2)} inches\nborder width: ${borderWidth.toFixed(2)} inches\nborder height: ${borderHeight.toFixed(2)} inches`;
    document.getElementById('previewContainer').style.display = 'block';
}

function updatePreview(paperWidth = null, paperHeight = null, imageWidth = null, imageHeight = null) { // update the preview of the paper and the image
    const paperPreview = document.getElementById('paperPreview');
    const printPreviewContainer = document.getElementById('printPreviewContainer');
    const printPreview = document.getElementById('printPreview');

    paperWidth = paperWidth !== null ? paperWidth : parseFloat(document.getElementById('paperWidth').value);
    paperHeight = paperHeight !== null ? paperHeight : parseFloat(document.getElementById('paperHeight').value);

    const [previewWidth, previewHeight] = previewOrientation === 'horizontal'
        ? [paperHeight, paperWidth]
        : [paperWidth, paperHeight];

    const maxWidth = paperPreview.parentElement.clientWidth;
    const maxHeight = paperPreview.parentElement.clientHeight;

    const scale = Math.min(maxWidth / previewWidth, maxHeight / previewHeight);

    paperPreview.style.width = `${previewWidth * scale}px`;
    paperPreview.style.height = `${previewHeight * scale}px`;

    if (imageWidth !== null && imageHeight !== null) {
        const [printPreviewWidth, printPreviewHeight] = previewOrientation === 'horizontal'
            ? [imageHeight, imageWidth]
            : [imageWidth, imageHeight];

        printPreviewContainer.style.width = `${printPreviewWidth * scale}px`;
        printPreviewContainer.style.height = `${printPreviewHeight * scale}px`;
        printPreview.style.width = '100%';
        printPreview.style.height = '100%';
    } else {
        printPreviewContainer.style.width = '0';
        printPreviewContainer.style.height = '0';
        printPreview.style.width = '0';
        printPreview.style.height = '0';
    }
}

function toggleOrientation() { // switch between horizontal and vertical preview
    previewOrientation = previewOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    calculateBorders();
}

function flipRatio() { // swap width and height
    const paperWidth = document.getElementById('paperWidth').value;
    document.getElementById('paperWidth').value = document.getElementById('paperHeight').value;
    document.getElementById('paperHeight').value = paperWidth;
    toggleOrientation()
    calculateBorders();
}