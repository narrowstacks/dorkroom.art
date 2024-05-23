function calculateExposure() {
    // Get the input values
    const initialTime = parseFloat(document.getElementById('initial-time').value);
    const stopChange = parseFloat(document.getElementById('stop-change').value);
    
    // Calculate the factor to multiply the initial time by
    const factor = Math.pow(2, stopChange);
    
    // Calculate the new exposure time
    const newTime = initialTime * factor;
    
    // Round the new exposure time to the nearest tenth of a second
    const roundedTime = Math.round(newTime * 10) / 10;
    
    // Display the new exposure time
    document.getElementById('new-time').textContent = roundedTime.toFixed(1);
}

document.getElementById('resizeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get input values
    const originalLength = parseFloat(document.getElementById('originalLength').value);
    const originalWidth = parseFloat(document.getElementById('originalWidth').value);
    const newLength = parseFloat(document.getElementById('newLength').value);
    const newWidth = parseFloat(document.getElementById('newWidth').value);
    const originalTime = parseFloat(document.getElementById('originalTime').value);

    // Calculate new exposure time and stops difference
    const result = calculateNewExposureTime(originalLength, originalWidth, newLength, newWidth, originalTime);

    // Display results
    document.getElementById('newExposureTime').textContent = `New Exposure Time: ${result.newExposureTime.toFixed(2)} seconds`;
    document.getElementById('stopsDifference').textContent = `Stops Difference: ${result.stopsDifference.toFixed(2)} stops`;
});

function calculateNewExposureTime(originalLength, originalWidth, newLength, newWidth, originalTime) {
    const originalArea = originalLength * originalWidth;
    const newArea = newLength * newWidth;
    const multiplierFactor = newArea / originalArea;
    const newExposureTime = originalTime * multiplierFactor;
    const stopsDifference = Math.log2(multiplierFactor);

    return {
        newExposureTime: newExposureTime,
        stopsDifference: stopsDifference
    };
}
