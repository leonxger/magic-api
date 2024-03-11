async function fetchNewCustomerData() {
    // Get form values
    var studioId = document.getElementById("studioId").value;
    var rateBundleTermId = document.getElementById("rateBundleTermId").value;
    var startDate = document.getElementById("startDate").value;
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var dateOfBirth = document.getElementById("dateOfBirth").value;
    var email = document.getElementById("email").value;
    var street = document.getElementById("street").value;
    var houseNumber = document.getElementById("houseNumber").value;
    var city = document.getElementById("city").value;
    var zipCode = document.getElementById("zipCode").value;
    var countryCode = document.getElementById("countryCode").value;

    const resp = await fetch(
        `https://connectdemo.api.magicline.com/connect/v1/rate-bundle`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            studioId: studioId,
            contract: {
                rateBundleTermId: rateBundleTermId,
                startDate: startDate,
            },
            customer: {
                firstname: firstname,
                lastname: lastname,
                dateOfBirth: dateOfBirth,
                email: email,
                street: street,
                houseNumber: houseNumber,
                city: city,
                zipCode: zipCode,
                countryCode: countryCode,
                paymentChoice: "DIRECT_DEBIT",
                bankAccount: {
                    iban: "DE89370400440532013000",
                    bic: "COBADEFFXXX",
                    accountHolder: "Leon Fischer",
                },
            },
        }),
    }
    )
        .then((response) => response.json())
        .then((data) => {
            createDynamicTableContent(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
}

async function fetchStudioData(studioTags = "", addressSearchQuery = "") {
    var studioTagsForm = document.getElementById("studioTags").value;
    var addressSearchQueryForm =
        document.getElementById("addressSearchQuery").value;

    const query = new URLSearchParams({
        studioTags: studioTagsForm,
        addressSearchQuery: addressSearchQueryForm,
    }).toString();

    const resp = await fetch(
        `https://connectdemo.api.magicline.com/connect/v2/studio?${query}`, { method: "GET" }
    )
        .then((response) => response.json())
        .then((data) => {
            createDynamicTableContent(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
}

async function fetchBundleTermData() {
    var studioIDForm = document.getElementById("studioID").value;

    if (!studioIDForm) return;

    const query = new URLSearchParams({
        studioId: studioIDForm,
    }).toString();

    const resp = await fetch(
        `https://connectdemo.api.magicline.com/connect/v1/rate-bundle?${query}`, { method: "GET" }
    )
        .then((response) => response.json())
        .then((data) => {
            createDynamicTableContent(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function createDynamicTableContent(data) {
    const table = document.getElementById("jsonTable");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    thead.innerHTML = "";
    tbody.innerHTML = "";

    // Create table header
    try {
        const keys = Object.keys(data[0]);
        const tr = document.createElement("tr");
        keys.forEach((key) => {
            const th = document.createElement("th");
            th.textContent = key;
            tr.appendChild(th);
        });
        thead.appendChild(tr);

        // Create table body
        data.forEach((item) => {
            const tr = document.createElement("tr");
            keys.forEach((key) => {
                const td = document.createElement("td");
                // Check if the value is an object and handle accordingly
                if (typeof item[key] === "object" && item[key] !== null) {
                    // Convert object to a string, or access its properties as needed
                    td.textContent = JSON.stringify(item[key], null, 2); // For a readable string representation
                } else {
                    td.textContent = item[key];
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } catch (error) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = data.message;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}