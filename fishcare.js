function showSection(name) {
    document.querySelectorAll('section').forEach(s => s.style.display = "none");
    if (name) document.getElementById(name).style.display = "";
}

// Dummy dropdown data for location
const divisions = ["[translate:ঢাকা]", "[translate:চট্টগ্রাম]", "[translate:রাজশাহী]"];
const districts = {
    "[translate:ঢাকা]": ["[translate:সাভার]", "[translate:গাজীপুর]"],
    "[translate:চট্টগ্রাম]": ["[translate:ফটিকছড়ি]", "[translate:মীরসরাই]"],
};
const upazilas = {
    "[translate:সাভার]": ["[translate:আশুলিয়া]", "[translate:কামারপাড়া]"],
    "[translate:গাজীপুর]": ["[translate:টঙ্গী]"],
};

// Load divisions at start
window.onload = function() {
    let divisionSelect = document.getElementById("divisionSelect");
    divisions.forEach(d => {
        let o = document.createElement("option");
        o.text = d;
        divisionSelect.add(o);
    });
}

function updateDistricts() {
    let division = document.getElementById("divisionSelect").value;
    let districtSelect = document.getElementById("districtSelect");
    districtSelect.innerHTML = '<option value="">[translate:জেলা নির্বাচন করুন]</option>';
    if (districts[division]) {
        districts[division].forEach(d => {
            let o = document.createElement("option");
            o.text = d;
            districtSelect.add(o);
        });
    }
    updateUpazilas();
}

function updateUpazilas() {
    let district = document.getElementById("districtSelect").value;
    let upazilaSelect = document.getElementById("upazilaSelect");
    upazilaSelect.innerHTML = '<option value="">[translate:উপজেলা নির্বাচন করুন]</option>';
    if (upazilas[district]) {
        upazilas[district].forEach(u => {
            let o = document.createElement("option");
            o.text = u;
            upazilaSelect.add(o);
        });
    }
}

function fetchMarketPrices() {
    // Dummy result for UI
    let tbody = document.querySelector("#priceTable tbody");
    tbody.innerHTML = `<tr>
        <td>[translate:বড়বাজার]</td>
        <td>[translate:রুই]</td>
        <td>1</td>
        <td>280</td>
        <td>300</td>
    </tr>`;
}

// Farmer inventory management
document.getElementById("inventoryForm").onsubmit = function(e){
    e.preventDefault();
    let form = e.target;
    let row = `<tr>
        <td>${form.pondName.value}</td>
        <td>${form.fishSpecies.value}</td>
        <td>${form.avgWeight.value}</td>
        <td>${form.quantity.value}</td>
    </tr>`;
    document.getElementById("inventoryTable").innerHTML += row;
    form.reset();
};

// Farmer ledger
document.getElementById("ledgerForm").onsubmit = function(e){
    e.preventDefault();
    let form = e.target;
    let row = `<tr>
        <td>${form.type.value}</td>
        <td>${form.desc.value}</td>
        <td>${form.amount.value}</td>
    </tr>`;
    document.getElementById("ledgerTable").innerHTML += row;
    form.reset();
};

// Seller transactions
document.getElementById("transactionForm").onsubmit = function(e){
    e.preventDefault();
    let form = e.target;
    let row = `<tr>
        <td>${form.type.value}</td>
        <td>${form.desc.value}</td>
        <td>${form.amount.value}</td>
    </tr>`;
    document.getElementById("transactionTable").innerHTML += row;
    form.reset();
};

// Invoice generator
function addInvoiceRow(){
    let invoiceRows = document.getElementById("invoiceRows");
    let idx = invoiceRows.children.length;
    let row = document.createElement("div");
    row.innerHTML = `
       <label>[translate:মাছের প্রজাতি]:
            <select id="species${idx}" onchange="updateInvoiceTotal()">
                <option>[translate:রুই]</option>
                <option>[translate:কাতলা]</option>
            </select>
        </label>
        <label>[translate:ওজন (কেজি)]: <input type="number" id="weight${idx}" oninput="updateInvoiceTotal()"></label>
        <label>[translate:দর (প্রতি কেজি)]: <input type="number" id="price${idx}" oninput="updateInvoiceTotal()"></label>
        <label>[translate:মোট]: <span id="sum${idx}">0</span></label>
    `;
    invoiceRows.appendChild(row);
}

function updateInvoiceTotal() {
    let invoiceRows = document.getElementById("invoiceRows").children;
    let total = 0;
    for (let i = 0; i < invoiceRows.length; i++) {
        let w = Number(document.getElementById("weight"+i).value) || 0;
        let p = Number(document.getElementById("price"+i).value) || 0;
        let sum = w * p;
        document.getElementById("sum"+i).innerText = sum;
        total += sum;
    }
    document.getElementById("totalAmount").innerText = total;
}

// Invoice form submit
document.getElementById("invoiceForm").onsubmit = function(e){
    e.preventDefault();
    let invoiceRows = document.getElementById("invoiceRows").children;
    let html = "<h3>[translate:চালানের বিবরণ]</h3><table><thead><tr><th>[translate:প্রজাতি]</th><th>[translate:ওজন]</th><th>[translate:দর]</th><th>[translate:মোট]</th></tr></thead><tbody>";
    for(let i=0; i<invoiceRows.length; i++) {
        let s = document.getElementById("species"+i).value;
        let w = document.getElementById("weight"+i).value;
        let p = document.getElementById("price"+i).value;
        let m = Number(w)*Number(p);
        html += `<tr><td>${s}</td><td>${w}</td><td>${p}</td><td>${m}</td></tr>`;
    }
    html += "</tbody></table><strong>[translate:সর্বমোট]: " + document.getElementById("totalAmount").innerText + "</strong>";
    let out = document.getElementById("invoiceResult");
    out.style.display = "";
    out.innerHTML = html;
}
