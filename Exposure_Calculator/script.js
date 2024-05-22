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
