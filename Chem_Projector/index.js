let chemicals = [
    {
        name: "Ilford Multigrade Dev 5L",
        amountSold: 5,
        amountSoldUnit: "L",
        amountUsed: 333,
        estimatedUses: 80,
        costPerContainer: 70
    },
    {
        name: "Ilford Rapid Fixer 5L",
        amountSold: 5,
        amountSoldUnit: "L",
        amountUsed: 500,
        estimatedUses: 60,
        costPerContainer: 60
    },
    {
        name: "Kodak Indicator Stop 16 fl oz",
        amountSold: 16,
        amountSoldUnit: "fl oz",
        amountUsed: 78,
        estimatedUses: 15,
        costPerContainer: 9
    },
    {
        name: "Kodak Photo Flo 16 fl oz",
        amountSold: 16,
        amountSoldUnit: "fl oz",
        amountUsed: 3,
        estimatedUses: 400,
        costPerContainer: 10.5
    },
    {
        name: "Heico Perma Wash 1 Gal",
        amountSold: 1,
        amountSoldUnit: "gal",
        amountUsed: 90,
        estimatedUses: 53,
        costPerContainer: 72
    }
];

const conversionFactors = {
    "ml": 1,
    "fl oz": 29.5735,
    "gal": 3785.41,
    "L": 1000
};

function loadTable() {
    const tableBody = document.getElementById('chemicals-table');
    chemicals.forEach((chemical, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <button class="delete-btn" onclick="deleteRow(${index})">-</button>
                <input type="text" id="name-${index}" value="${chemical.name}">
            </td>
            <td>
                <input type="number" id="amountSold-${index}" value="${chemical.amountSold}">
                <select id="unit-${index}">
                    <option value="ml" ${chemical.amountSoldUnit === 'ml' ? 'selected' : ''}>ml</option>
                    <option value="fl oz" ${chemical.amountSoldUnit === 'fl oz' ? 'selected' : ''}>fl oz</option>
                    <option value="gal" ${chemical.amountSoldUnit === 'gal' ? 'selected' : ''}>gal</option>
                    <option value="L" ${chemical.amountSoldUnit === 'L' ? 'selected' : ''}>L</option>
                </select>
            </td>
            <td><input type="number" id="amountUsed-${index}" value="${chemical.amountUsed}"></td>
            <td><input type="number" id="usage-${index}" value="${chemical.estimatedUses}"></td>
            <td>
                <div style="display: flex; align-items: center;">
                    <span>$</span>
                    <input type="number" id="cost-${index}" value="${chemical.costPerContainer}" style="margin-left: 5px;">
                </div>
            </td>
            <td id="uses-${index}"></td>
            <td id="costTotal-${index}"></td>
            <td id="costPerUse-${index}"></td>
        `;
    
        tableBody.appendChild(row);
    });
}

function addRow() {
    const tableBody = document.getElementById('chemicals-table');
    const index = chemicals.length;
    chemicals.push({
        name: "",
        amountSold: 0,
        amountSoldUnit: "ml",
        amountUsed: 0,
        estimatedUses: 0,
        costPerContainer: 0
    });
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <button class="delete-btn" onclick="deleteRow(${index})">-</button>
            <input type="text" id="name-${index}" value="">
        </td>
        <td>
            <input type="number" id="amountSold-${index}" value="0">
            <select id="unit-${index}">
                <option value="ml" selected>ml</option>
                <option value="fl oz">fl oz</option>
                <option value="gal">gal</option>
                <option value="L">L</option>
            </select>
        </td>
        <td><input type="number" id="amountUsed-${index}" value="0"></td>
        <td><input type="number" id="usage-${index}" value="0"></td>
        <td><input type="number" id="cost-${index}" value="0"></td>
        <td id="uses-${index}"></td>
        <td id="costTotal-${index}"></td>
        <td id="costPerUse-${index}"></td>
    `;
    
    tableBody.appendChild(row);
}

function deleteRow(index) {
    chemicals.splice(index, 1);
    const tableBody = document.getElementById('chemicals-table');
    tableBody.innerHTML = '';
    loadTable();
    calculateResults();
}

function calculateResults() {
    let totalEstimatedCost = 0;
    chemicals.forEach((chemical, index) => {
        const amountSold = document.getElementById(`amountSold-${index}`).value;
        const amountUsed = document.getElementById(`amountUsed-${index}`).value;
        const unit = document.getElementById(`unit-${index}`).value;
        const estimatedUses = document.getElementById(`usage-${index}`).value;
        const costPerContainer = document.getElementById(`cost-${index}`).value;

        const amountSoldInMl = amountSold * conversionFactors[unit];
        const usesPerContainer = Math.floor(amountSoldInMl / amountUsed);
        const containersNeeded = Math.ceil(estimatedUses / usesPerContainer);
        const costForPeriod = containersNeeded * costPerContainer;
        const costPerUse = costForPeriod / estimatedUses;

        document.getElementById(`uses-${index}`).textContent = usesPerContainer;
        document.getElementById(`costTotal-${index}`).textContent = `$${costForPeriod.toFixed(2)}`;
        document.getElementById(`costPerUse-${index}`).textContent = `$${costPerUse.toFixed(2)}`;

        totalEstimatedCost += costForPeriod;
    });

    document.getElementById('total-estimated-cost').textContent = `$${totalEstimatedCost.toFixed(2)}`;
}

function calculateDeveloperUses() {            
    const fromDate = new Date(document.getElementById('from-date').value);
    const toDate = new Date(document.getElementById('to-date').value);
    const numClasses = parseInt(document.getElementById('num-classes').value);

    if (isNaN(fromDate) || isNaN(toDate) || fromDate > toDate || isNaN(numClasses) || numClasses < 0) {
        document.getElementById('developer-uses').textContent = 'Please select valid dates and enter a valid number of classes.';
        document.getElementById('developer-uses-special').textContent = '';
        return;
    }

    let tuesdayCount = 0;
    let wednesdayCount = 0;
    let thursdayCount = 0;
    let saturdayCount = 0;

    for (let date = new Date(fromDate); date <= toDate; date.setDate(date.getDate() + 1)) {
        const day = date.getDay();
        if (day === 2) tuesdayCount++;
        if (day === 3) wednesdayCount++;
        if (day === 4) thursdayCount++;
        if (day === 6) saturdayCount++;
    }

    const totalUses = tuesdayCount + wednesdayCount + thursdayCount + saturdayCount;
    const specialUses = tuesdayCount + wednesdayCount + thursdayCount + (2 * saturdayCount) + (numClasses * 5);

    document.getElementById('developer-uses').textContent = `Minimum uses: ${totalUses}`;
    document.getElementById('developer-uses-special').textContent = `Total uses, including double on Saturdays plus ${numClasses} classes meeting 5 times: ${specialUses}`;
}

function calc_vol() {
    if (document.form1.units1.value.length == 0) {
        document.form1.units1.value = 0;
    }
    if (document.form1.units2.value.length == 0) {
        document.form1.units2.value = 0;
    }
    if (document.form1.units3.value.length == 0) {
        document.form1.units3.value = 0;
    }

    var FinalVol = parseFloat(document.form1.vol.value, 10);
    var Units1 = parseFloat(document.form1.units1.value, 10);
    var Units2 = parseFloat(document.form1.units2.value, 10);
    var Units3 = parseFloat(document.form1.units3.value, 10);

    var TotalUnits = Units1 + Units2 + Units3;
    var TotalMix = FinalVol / TotalUnits;

    document.getElementById('Total1').innerHTML = `<span>${Math.round(TotalMix * Units1)}</span> ml`;
    document.getElementById('Total2').innerHTML = `+ <span>${Math.round(TotalMix * Units2)}</span> ml`;

    if (Units3 > 0) {
        document.getElementById('Total3').innerHTML = `+ <span>${Math.round(TotalMix * Units3)}</span> ml`;
    } else {
        document.getElementById('Total3').innerHTML = "";
    }

    document.getElementById('Water').innerHTML = "water";
}

function returnToHome() {
    window.location.href = '/index.html'; // Replace with the appropriate URL
}
window.onload = function() {
    loadTable();
};


window.onload = loadTable;
