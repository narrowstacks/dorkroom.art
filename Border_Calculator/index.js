let previewOrientation = 'vertical';

function updatePaperSize() {
    const paperSize = document.getElementById('paperSize').value;
    const customDimensions = document.getElementById('customDimensions');
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

    if (paperSize === "Custom") {
        customDimensions.style.display = "flex";
    } else {
        customDimensions.style.display = "none";
        document.getElementById('paperWidth').value = dimensions[paperSize][0];
        document.getElementById('paperHeight').value = dimensions[paperSize][1];
        updatePreview();
    }
}

function setCustomSize() {
    document.getElementById('paperSize').value = "Custom";
    document.getElementById('customDimensions').style.display = "flex";
    updatePreview();
}

function calculateBorders() {
    // Get input values
    const aspectRatio = eval(document.getElementById('aspectRatio').value);
    const paperWidth = parseFloat(document.getElementById('paperWidth').value);
    const paperHeight = parseFloat(document.getElementById('paperHeight').value);
    const minBorder = parseFloat(document.getElementById('minBorder').value);

    // make sure minBorder is a valid number and not 0 or negative
    if (isNaN(minBorder) || minBorder <= 0) {
        document.getElementById('result').innerText = 'Minimum border must be a positive number';
        document.getElementById('previewContainer').style.display = 'none';
        return;
    }

    // check to see that the minimum border is less than half the shortest side of the paper
    if (minBorder >= Math.min(paperWidth, paperHeight) / 2) {
        document.getElementById('result').innerText = 'Minimum border must be less than half the shortest side of the paper';
        document.getElementById('previewContainer').style.display = 'none';
        return;
    }

    // Calculate available space for the image
    const availableWidth = paperWidth - 2 * minBorder;
    const availableHeight = paperHeight - 2 * minBorder;

    // Calculate the image dimensions based on aspect ratio
    let imageWidth, imageHeight;
    if (availableWidth / aspectRatio <= availableHeight) {
        imageWidth = availableWidth;
        imageHeight = availableWidth / aspectRatio;
    } else {
        imageHeight = availableHeight;
        imageWidth = availableHeight * aspectRatio;
    }

    // Calculate the actual borders
    const borderWidth = (paperWidth - imageWidth) / 2;
    const borderHeight = (paperHeight - imageHeight) / 2;

    // Display the result
    document.getElementById('result').innerText = `Ideal Image Dimensions: ${imageWidth.toFixed(2)} x ${imageHeight.toFixed(2)} inches\nBorder Width: ${borderWidth.toFixed(2)} inches\nBorder Height: ${borderHeight.toFixed(2)} inches`;

    // Update preview
    document.getElementById('previewContainer').style.display = 'block';
    updatePreview(paperWidth, paperHeight, imageWidth, imageHeight);
}

function updatePreview(paperWidth = null, paperHeight = null, imageWidth = null, imageHeight = null) {
    const paperPreview = document.getElementById('paperPreview');
    const printPreviewContainer = document.getElementById('printPreviewContainer');
    const printPreview = document.getElementById('printPreview');

    paperWidth = paperWidth !== null ? paperWidth : parseFloat(document.getElementById('paperWidth').value);
    paperHeight = paperHeight !== null ? paperHeight : parseFloat(document.getElementById('paperHeight').value);

    const [previewWidth, previewHeight] = previewOrientation === 'vertical'
        ? [paperWidth, paperHeight]
        : [paperHeight, paperWidth];

    const maxWidth = paperPreview.parentElement.clientWidth;
    const maxHeight = paperPreview.parentElement.clientHeight;

    const scale = Math.min(maxWidth / previewWidth, maxHeight / previewHeight);

    paperPreview.style.width = `${previewWidth * scale}px`;
    paperPreview.style.height = `${previewHeight * scale}px`;

    if (imageWidth !== null && imageHeight !== null) {
        const [printPreviewWidth, printPreviewHeight] = previewOrientation === 'vertical'
            ? [imageWidth, imageHeight]
            : [imageHeight, imageWidth];

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

function toggleOrientation() {
    previewOrientation = previewOrientation === 'vertical' ? 'horizontal' : 'vertical';
    calculateBorders();
}

// Ensure default values are set correctly on page load
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('aspectRatio').selectedIndex = 0;
    document.getElementById('paperSize').selectedIndex = 0;
    updatePaperSize();
});
