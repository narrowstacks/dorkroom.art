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
    
    // Calculate the difference between the new time and the initial time
    const timeDifference = roundedTime - initialTime;
    const roundedDifference = Math.round(timeDifference * 10) / 10;
    
    // Determine whether to add or remove time
    const differenceText = roundedDifference > 0 ? 'add' : 'remove';
    const absoluteDifference = Math.abs(roundedDifference);
    
    // Format the output to hide decimals if the number is an integer
    const formatNumber = (number) => {
        return Number.isInteger(number) ? number.toString() : number.toFixed(1);
    };
    
    // Display the new exposure time
    document.getElementById('new-time').textContent = formatNumber(roundedTime);
    
    // Display the difference in exposure time
    document.getElementById('time-difference').textContent = `${differenceText} ${formatNumber(absoluteDifference)}`;
    
    // Show the new exposure time container
    document.getElementById('new-time-container').classList.remove('hidden');
    
    // Show the time difference container
    document.getElementById('time-difference-container').classList.remove('hidden');
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

    // throw an error if change in stops is blank
    if (isNaN(stopsDifference)) {
        throw new Error('Change in stops cannot be blank');
    }

    return {
        newExposureTime: newExposureTime,
        stopsDifference: stopsDifference
    };
    
}
