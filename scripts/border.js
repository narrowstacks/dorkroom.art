let previewOrientation = 'horizontal';

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
    const offsetInputs = document.getElementById('offsetInputs');
    offsetInputs.style.display = document.getElementById('enableOffset').checked ? 'block' : 'none';
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
    if (enableOffset) {
        const horizontalOffset = parseFloat(document.getElementById('horizontalOffset').value);
        const verticalOffset = parseFloat(document.getElementById('verticalOffset').value);

        borderWidth -= horizontalOffset;
        borderHeight -= verticalOffset;

        if (borderWidth < 0 || borderHeight < 0) {
            displayError('error: offsets result in negative borders');
            return;
        }
    }

    displayResult(imageWidth, imageHeight, borderWidth, borderHeight);
    updatePreview(paperWidth, paperHeight, imageWidth, imageHeight);
}
function calcImageAndBorderSizes(paperSize, printAspectRatio, minBorder, heightOff = 0, widthOff = 0) {
    const [paperW, paperH] = paperSize.split('x').map(Number);
    const [aspectW, aspectH] = printAspectRatio.split(':').map(Number);
    
    let imgW, imgH;

    // Calculate the maximum possible width and height of the image while maintaining the aspect ratio
    if ((paperW - 2 * minBorder) / aspectW < (paperH - 2 * minBorder) / aspectH) {
        imgW = paperW - 2 * minBorder;
        imgH = imgW * aspectH / aspectW;
    } else {
        imgH = paperH - 2 * minBorder;
        imgW = imgH * aspectW / aspectH;
    }
    
    // Set the easel blade positions to match the image size exactly
    const leftBlade = imgW - widthOff;
    const rightBlade = imgW + widthOff;
    const topBlade = imgH - heightOff;
    const bottomBlade = imgH + heightOff;
    
    return {
        imageSize: `${imgW.toFixed(1)}x${imgH.toFixed(1)}in`,
        leftBlade: `${leftBlade.toFixed(1)}in`,
        rightBlade: `${rightBlade.toFixed(1)}in`,
        topBlade: `${topBlade.toFixed(1)}in`,
        bottomBlade: `${bottomBlade.toFixed(1)}in`
    };
}


function calculateImageDimensions(availableWidth, availableHeight, aspectRatio) {
    if (availableWidth / aspectRatio <= availableHeight) {
        return [availableWidth, availableWidth / aspectRatio];
    } else {
        return [availableHeight * aspectRatio, availableHeight];
    }
}

function displayResult(imageWidth, imageHeight, borderWidth, borderHeight) {
    // convert calcIma
    document.getElementById('result').innerText = `image dimensions: ${imageHeight.toFixed(2)} x ${imageWidth.toFixed(2)} inches\nborder height: ${borderHeight.toFixed(2)} inches\nborder width: ${borderWidth.toFixed(2)} inches`;
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