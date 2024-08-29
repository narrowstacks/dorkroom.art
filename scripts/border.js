let previewOrientation = 'horizontal';

let storedOffsets = { horizontal: 0, vertical: 0 };
let offsetsInitialized = false; // Flag to track if offsets have been initialized


console.log("test")

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    aspectRatio = calculateAspectRatio(document.getElementById('aspectRatio').value);
    paperSize = document.getElementById('paperSize').value;
    paperDimensions = getPaperDimensions(paperSize);
    paperWidth = 0;
    paperHeight = 0;

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
    document.getElementById('enableOffset').addEventListener('change', toggleOffsets);
}



function toggleOffsets() {
    const enableOffset = document.getElementById('enableOffset').checked;
    const offsetInputs = document.getElementById('offsetInputs');

    if (enableOffset) {
        // Only set defaults the first time offsets are enabled
        if (!offsetsInitialized) {
            document.getElementById('horizontalOffset').value = 0;
            document.getElementById('verticalOffset').value = 0;
            offsetsInitialized = true; // Mark that the offsets have been initialized
        } else {
            // Restore previously stored offsets
            document.getElementById('horizontalOffset').value = storedOffsets.horizontal;
            document.getElementById('verticalOffset').value = storedOffsets.vertical;
        }
    } else {
        // Store current offset values
        storedOffsets.horizontal = document.getElementById('horizontalOffset').value;
        storedOffsets.vertical = document.getElementById('verticalOffset').value;
    }

    offsetInputs.style.display = enableOffset ? 'block' : 'none';

    // Recalculate borders to reflect the current state of offsets
    calculateBorders();
}


function getPaperDimensions(paperSize) {
    const dimensions = {
        "4x5": [5, 4],
        "4x6": [6, 5],
        "5x7": [7, 5],
        "8x10": [10, 8],
        "11x14": [14, 11],
        "16x20": [20, 16],
        "20x24": [24, 20],
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
        document.getElementById('paperWidth').value = '';
        document.getElementById('paperHeight').value = '';
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

function updateAspectRatio() {
    const aspectRatioElement = document.getElementById('aspectRatio');
    const customAspectRatio = document.getElementById('customAspectRatio');

    if (aspectRatioElement.value === "Custom") {
        customAspectRatio.style.display = "flex";
        
        // Set default values
        document.getElementById('customAspectWidth').value = "4";
        document.getElementById('customAspectHeight').value = "3";
    } else {
        customAspectRatio.style.display = "none";
    }

    aspectRatio = calculateAspectRatio(aspectRatioElement.value);
    calculateBorders();  // Ensure borders are recalculated with the updated aspect ratio
}
function setCustomAspectRatio() {
    document.getElementById('aspectRatio').value = "Custom";
    document.getElementById('customAspectRatio').style.display = "flex";
    calculateBorders();
}

function calculateAspectRatio(aspectRatioValue) {
    if (aspectRatioValue === "Custom") {
        const customWidth = parseFloat(document.getElementById('customAspectWidth').value);
        const customHeight = parseFloat(document.getElementById('customAspectHeight').value);
        if (isNaN(customWidth) || isNaN(customHeight) || customWidth <= 0 || customHeight <= 0) {
            displayError('error: custom aspect ratio dimensions must be positive numbers');
            return null;
        }
        return customWidth / customHeight;
    }
    return eval(aspectRatioValue);
}

function displayError(message) {
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
    
    let borderWidth = (paperWidth - imageWidth) / 2;
    let borderHeight = (paperHeight - imageHeight) / 2;    

    const enableOffset = document.getElementById('enableOffset').checked;
    let horizontalOffset = 0;
    let verticalOffset = 0;

    if (enableOffset) {
        horizontalOffset = parseFloat(document.getElementById('horizontalOffset').value);
        verticalOffset = parseFloat(document.getElementById('verticalOffset').value);

        borderWidth -= horizontalOffset;
        borderHeight -= verticalOffset;

        // Additional check to ensure that the image does not exceed the paper boundaries on the opposite sides
        if (borderWidth + imageWidth > paperWidth || borderHeight + imageHeight > paperHeight || borderWidth < 0 || borderHeight < 0) {
            displayError('error: offsets result in the image exceeding the paper boundaries');
            return;
        }
    }

    // Calculate easel blade positions
    const leftBlade = imageWidth + horizontalOffset;
    const rightBlade = imageWidth - horizontalOffset;
    const topBlade = imageHeight - verticalOffset;
    const bottomBlade = imageHeight - verticalOffset

    displayResult(imageWidth, imageHeight, borderWidth, borderHeight, leftBlade, rightBlade, topBlade, bottomBlade);
    updatePreview(paperWidth, paperHeight, imageWidth, imageHeight);
}




function calculateImageDimensions(availableWidth, availableHeight, aspectRatio) {
    if (availableWidth / aspectRatio <= availableHeight) {
        return [availableWidth, availableWidth / aspectRatio];
    } else {
        return [availableHeight * aspectRatio, availableHeight];
    }
}

function displayResult(imageWidth, imageHeight, borderWidth, borderHeight, leftBlade, rightBlade, topBlade, bottomBlade) {
    document.getElementById('result').innerText = 
        `image dimensions: ${imageHeight.toFixed(2)} x ${imageWidth.toFixed(2)} inches\n` +
        // `border height: ${borderHeight.toFixed(2)} inches\n` +
        // `border width: ${borderWidth.toFixed(2)} inches\n` +
        `left blade: ${leftBlade.toFixed(2)} inches\n` +
        `right blade: ${rightBlade.toFixed(2)} inches\n` +
        `top blade: ${topBlade.toFixed(2)} inches\n` +
        `bottom blade: ${bottomBlade.toFixed(2)} inches`;

    document.getElementById('previewContainer').style.display = 'block';
}

function updatePreview(paperWidth = null, paperHeight = null, imageWidth = null, imageHeight = null) {
    const paperPreview = document.getElementById('paperPreview');
    const printPreviewContainer = document.getElementById('printPreviewContainer');
    const printPreview = document.getElementById('printPreview');

    paperWidth = paperWidth !== null ? paperWidth : parseFloat(document.getElementById('paperWidth').value);
    paperHeight = paperHeight !== null ? paperHeight : parseFloat(document.getElementById('paperHeight').value);

    const [previewWidth, previewHeight] = previewOrientation === 'vertical'
        ? [paperHeight, paperWidth]
        : [paperWidth, paperHeight];

    const maxWidth = paperPreview.parentElement.clientWidth;
    const maxHeight = paperPreview.parentElement.clientHeight;

    const scale = Math.min(maxWidth / previewWidth, maxHeight / previewHeight);

    paperPreview.style.width = `${previewWidth * scale}px`;
    paperPreview.style.height = `${previewHeight * scale}px`;

    if (imageWidth !== null && imageHeight !== null) {
        const [printPreviewWidth, printPreviewHeight] = previewOrientation === 'vertical'
            ? [imageHeight, imageWidth]
            : [imageWidth, imageHeight];

        printPreviewContainer.style.width = `${printPreviewWidth * scale}px`;
        printPreviewContainer.style.height = `${printPreviewHeight * scale}px`;
        printPreview.style.width = '100%';
        printPreview.style.height = '100%';

        const enableOffset = document.getElementById('enableOffset').checked;
        if (enableOffset) {
            const horizontalOffset = parseFloat(document.getElementById('horizontalOffset').value) * scale;
            const verticalOffset = parseFloat(document.getElementById('verticalOffset').value) * scale;
            printPreviewContainer.style.transform = `translate(${horizontalOffset}px, ${verticalOffset}px)`;
        } else {
            printPreviewContainer.style.transform = 'translate(0, 0)';
        }
    } else {
        printPreviewContainer.style.width = '0';
        printPreviewContainer.style.height = '0';
        printPreview.style.width = '0';
        printPreview.style.height = '0';
    }
}

function toggleOrientation() { 
    previewOrientation = previewOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    
    // Swap the offset values programmatically
    const horizontalOffset = parseFloat(document.getElementById('horizontalOffset').value);
    const verticalOffset = parseFloat(document.getElementById('verticalOffset').value);
    
    document.getElementById('horizontalOffset').value = verticalOffset;
    document.getElementById('verticalOffset').value = horizontalOffset;
    
    calculateBorders();
}

function flipRatio() {
    const paperWidth = document.getElementById('paperWidth').value;
    document.getElementById('paperWidth').value = document.getElementById('paperHeight').value;
    document.getElementById('paperHeight').value = paperWidth;

    const horizontalOffset = document.getElementById('horizontalOffset').value;
    document.getElementById('horizontalOffset').value = document.getElementById('verticalOffset').value;
    document.getElementById('verticalOffset').value = horizontalOffset;

    toggleOrientation();
    calculateBorders();
}