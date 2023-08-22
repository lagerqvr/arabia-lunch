// Icons for themes
const default_icon = `<svg class="MuiSvgIcon-root" width="25" height="25" fill="currentColor" id="theme-toggler" onclick="toggleTheme()" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"></path></svg>`;
const dark_icon = `<svg class="MuiSvgIcon-root" width="25" height="25" fill="currentColor" id="theme-toggler" onclick="toggleTheme()" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path></svg>`;

// Element for theme toggle
const togglerdiv = document.querySelector('#toggler-div');

// Function to set the theme icon and data-bs-theme attribute based on user preference or stored theme
const checkTheme = () => {
    try {
        if (localStorage.getItem('website_theme') === 'dark_mode') {
            togglerdiv.innerHTML = dark_icon;
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            togglerdiv.innerHTML = default_icon;
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    } catch (error) {
        outputError(error.message + ` (${error.stack})`);
        console.log(error.message);
    }
};

// Call the function to set initial theme icon and data-bs-theme attribute
checkTheme();

// Function for toggling theme
const toggleTheme = () => {
    try {
        if (localStorage.getItem('website_theme') === 'dark_mode') {
            localStorage.setItem('website_theme', 'default');
        } else {
            localStorage.setItem('website_theme', 'dark_mode');
        }
        checkTheme(); // Update the theme icon and data-bs-theme attribute
    } catch (error) {
        outputError(error.message + ` (${error.stack})`);
        console.log(error.message);
    }
};

// Check if theme is set and set theme based on stored preference
const getTheme = () => {
    try {
        let theme = localStorage.getItem('website_theme');
        if (theme != null) {
            checkTheme(); // Update the theme icon and data-bs-theme attribute
        }
    } catch (error) {
        outputError(error.message + ` (${error.stack})`);
        console.log(error.message);
    }
};
getTheme();

/// Function to fetch and display current date
const getDate = () => {
    try {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        document.querySelector('.currentDate').innerHTML = ' - ' + formattedDate;
    } catch (error) {
        outputError(error.message + ` (${error.stack})`);
        console.log(error.message);
    }
};
getDate();

// Log result to application log
const outputError = (input) => {
    try {
        document.querySelector("#errorMsg").innerHTML += `<p class="text-danger ml-1 mt-1 mb-0"><b>${input}</b></p>`;
    } catch (error) {
        outputError(error.message + ` (${error.stack})`);
        console.log(error.message);
    }
};

// Function to fetch and display the lunch for the specific day
async function fetchLunchMenu(URL, divId) {
    try {
        // Fetch the JSON content
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        document.getElementById(divId).innerHTML = '<p>Fetching data...</p>';

        const data = await response.json();
        console.log('Fetched data:', data);

        // Clear the div
        document.getElementById(divId).innerHTML = '';

        // Get the div where you want to display the data
        const lunchDiv = document.getElementById(divId);

        // Find today's lunch menu
        const today = new Date().toISOString().split('T')[0] + 'T00:00:00+00:00';
        console.log(today);
        const todayMenu = data.MenusForDays.find(dayMenu => dayMenu.Date === today);
        console.log(todayMenu);

        if (todayMenu && todayMenu.SetMenus) {
            const lunchTime = document.createElement('p');
            lunchTime.innerHTML = `<b class="text-success">${todayMenu.LunchTime}</b>`;
            lunchDiv.appendChild(lunchTime);
            for (const menu of todayMenu.SetMenus) {
                const menuParagraph = document.createElement('p');
                const components = menu.Components.join(', ');

                // Add the menu name to the paragraph for DIAK
                if (divId === 'diak-menu') {
                    const menuName = menu.Name;
                    const trimmedMenuName = menuName.split(' ')[0]; // Get the first word "Vegetable"
                    const updatedMenuName = trimmedMenuName + " lunch";
                    if (updatedMenuName === 'Lunch lunch') {
                        menuParagraph.innerHTML = `<b>Lunch:</b> ${components}`;
                        lunchDiv.appendChild(menuParagraph);
                    } else {
                        menuParagraph.innerHTML = `<b>${updatedMenuName}:</b> ${components}`;
                        lunchDiv.appendChild(menuParagraph);
                    }
                } else {
                    menuParagraph.innerHTML = `<b>${menu.Name}:</b> ${components}`;
                    lunchDiv.appendChild(menuParagraph);
                }
            }
        } else {
            lunchDiv.innerHTML = '<p>No lunch data available for today.</p>';
        }

    } catch (error) {
        outputError(error.message + ` (${error.stack})`);
        console.error('An error occurred:', error);
    }
};

// Call the async function to fetch and display the food menu
fetchLunchMenu('https://www.compass-group.fi/menuapi/feed/json?costNumber=3003&language=en', 'arcada-menu');
fetchLunchMenu('https://www.compass-group.fi/menuapi/feed/json?costNumber=3104&language=en', 'diak-menu');
// fetchLunchMenu('', 'chemicum-menu');
fetchLunchMenu('https://www.compass-group.fi/menuapi/feed/json?costNumber=1256&language=en', 'artebia-menu');
