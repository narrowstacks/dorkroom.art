document.addEventListener('DOMContentLoaded', function() {
    // Initialize the necessary functions and event listeners
    initialize();
    displayResults(0, 0);
});

function initialize() {
    // Add event listener for form submission
    const resizeForm = document.getElementById('resizeForm');
    if (resizeForm) {
        resizeForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get input values
            const originalLength = parseFloat(document.getElementById('originalLength').value);
            const originalWidth = parseFloat(document.getElementById('originalWidth').value);
            const newLength = parseFloat(document.getElementById('newLength').value);
            const newWidth = parseFloat(document.getElementById('newWidth').value);
            const originalTime = parseFloat(document.getElementById('originalTime').value);

            // Validate inputs
            if (isNaN(originalLength) || isNaN(originalWidth) || isNaN(newLength) || isNaN(newWidth) || isNaN(originalTime)) {
                alert("Please enter valid numerical values for all fields.");
                return;
            }

            // Calculate new exposure time and stops difference
            const result = calculateNewExposureTime(originalLength, originalWidth, newLength, newWidth, originalTime);

            // Display results
            displayResults(result.newExposureTime, result.stopsDifference);
        });
    } else {
        console.error('Form element not found. Ensure that the form with id "resizeForm" exists in the HTML.');
    }
}

function calculateNewExposureTime(originalLength, originalWidth, newLength, newWidth, originalTime) {
    const originalArea = originalLength * originalWidth;
    const newArea = newLength * newWidth;

    const multiplierFactor = newArea / originalArea;
    const newExposureTime = originalTime * multiplierFactor;

    // Calculate the stops difference using a logarithmic scale (base 2)
    const stopsDifference = Math.log2(newExposureTime / originalTime);

    return { newExposureTime, stopsDifference };
}

function displayResults(newExposureTime, stopsDifference) {
    const newExposureTimeElement = document.getElementById('newExposureTime');
    const stopsDifferenceElement = document.getElementById('stopsDifference');

    if (newExposureTimeElement && stopsDifferenceElement) {
        newExposureTimeElement.textContent = `New Exposure Time: ${newExposureTime.toFixed(2)} seconds`;
        stopsDifferenceElement.textContent = `Stops Difference: ${stopsDifference.toFixed(2)} stops`;

        // Make sure the elements are visible
        newExposureTimeElement.classList.remove('hidden');
        stopsDifferenceElement.classList.remove('hidden');
    } else {
        console.error('Result display elements not found. Ensure that the elements with ids "newExposureTime" and "stopsDifference" exist in the HTML.');
    }
}