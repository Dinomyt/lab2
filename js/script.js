document.addEventListener('DOMContentLoaded', function() {
    // --- Provided API Endpoints ---
    const cityInfoAPI = "https://csumb.space/api/cityInfoAPI.php?zip=";
    const countyListAPI = "https://csumb.space/api/countyListAPI.php?state=";
    const usernamesAPI = "https://csumb.space/api/usernamesAPI.php?username=";
    const allStatesAPI = "https://csumb.space/api/allStatesAPI.php";
    const suggestedPasswordAPI = "https://csumb.space/api/suggestedPassword.php?length=8";

    // --- DOM Element Selectors ---
    const form = document.querySelector("#signupForm");
    const usernameInput = document.querySelector("#username");
    const usernameStatus = document.querySelector("#usernameStatus");
    const passwordInput = document.querySelector("#password");
    const passwordSuggestion = document.querySelector("#passwordSuggestion");
    const retypePasswordInput = document.querySelector("#retypePassword");
    const passwordError = document.querySelector("#passwordError");
    const retypePasswordError = document.querySelector("#retypePasswordError");
    const stateSelect = document.querySelector("#state");
    const countySelect = document.querySelector("#county");
    const zipInput = document.querySelector("#zipCode");
    const zipCodeError = document.querySelector("#zipCodeError");
    const cityInput = document.querySelector("#city");
    const latitudeInput = document.querySelector("#latitude");
    const longitudeInput = document.querySelector("#longitude");
    
    // --- Helper function for API calls ---
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch operation error:', error);
            return null;
        }
    }

    // --- API Functions ---

    // 6) Get all US states on page load
    async function loadStates() {
        const states = await fetchData(allStatesAPI);
        if (states) {
            states.forEach(state => {
                stateSelect.add(new Option(state.state, state.usps));
            });
        }
    }
    
    // 3) Get county list when a state is selected
    async function getCounties() {
        const stateCode = stateSelect.value;
        countySelect.innerHTML = "<option>Select County...</option>"; // Reset dropdown
        if (!stateCode) return;

        const counties = await fetchData(countyListAPI + stateCode);
        if (counties) {
            counties.forEach(item => {
                countySelect.add(new Option(item.county, item.county));
            });
        }
    }

    // 1 & 2) Get city/lat/lon when a zip code is entered
    async function getCityInfo() {
        // Clear previous results/errors
        cityInput.value = "";
        latitudeInput.value = "";
        longitudeInput.value = "";
        zipCodeError.textContent = "";

        if (zipInput.value.length !== 5) return;

        const data = await fetchData(cityInfoAPI + zipInput.value);
        if (data) {
            cityInput.value = data.city;
            latitudeInput.value = data.latitude;
            longitudeInput.value = data.longitude;
        } else {
            zipCodeError.textContent = "Zip code not found.";
        }
    }

    // 4) Check if username is available while typing
    async function checkUsername() {
        if (usernameInput.value.length === 0) {
            usernameStatus.innerHTML = '';
            return;
        }
        const data = await fetchData(usernamesAPI + usernameInput.value);
        if (data && data.available) {
            usernameStatus.innerHTML = "Username is available!";
            usernameStatus.className = 'text-success';
        } else {
            usernameStatus.innerHTML = "Username is taken.";
            usernameStatus.className = 'text-danger';
        }
    }
    
    // 5) Suggest a password on focus
    async function getPasswordSuggestion() {
        const data = await fetchData(suggestedPasswordAPI);
        if (data && data.password) {
            passwordSuggestion.textContent = `Suggested: ${data.password}`;
        }
    }
    
    // 8 & 9) Validate form on submission
    function validateForm(event) {
        let isValid = true;
        // Clear previous errors
        passwordError.textContent = "";
        retypePasswordError.textContent = "";

        // Password length validation
        if (passwordInput.value.length < 6) {
            passwordError.textContent = "Password must be at least 6 characters long.";
            isValid = false;
        }

        // Password match validation
        if (passwordInput.value !== retypePasswordInput.value) {
            retypePasswordError.textContent = "Passwords do not match.";
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault(); // Stop form submission
        } else {
            // 10) Redirect to welcome page on success
            event.preventDefault();
            window.location.href = "welcome.html";
        }
    }

    // --- Event Listeners ---
    stateSelect.addEventListener('change', getCounties);
    zipInput.addEventListener('input', getCityInfo);
    usernameInput.addEventListener('input', checkUsername);
    passwordInput.addEventListener('focus', getPasswordSuggestion, { once: true });
    form.addEventListener('submit', validateForm);
    
    // --- Initial Function Call ---
    loadStates();
});