const modes = ["imperial", "metric"];
const modeIcons = {
	imperial: "🇺🇸",
	metric: "🌍",
};

// Function to convert imperial to metric
function imperialToMetric(value, unit) {
	switch (unit) {
		case "inches":
			return (value * 2.54).toFixed(2) + " cm";
		case "feet":
			return (value * 0.3048).toFixed(2) + " m";
		case "yards":
			return (value * 0.9144).toFixed(2) + " m";
		case "miles":
			return (value * 1.60934).toFixed(2) + " km";
		case "pounds":
			return (value * 0.453592).toFixed(2) + " kg";
		case "ounces":
			return (value * 28.3495).toFixed(2) + " g";
		default:
			return value + " " + unit;
	}
}

// Call the conversion function when the page loads
document.addEventListener("DOMContentLoaded", convertToMetric);
