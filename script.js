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
        console.log(error.message);
    }
};
getTheme();

// Function to fetch and display the food menu
async function fetchFoodMenu(URL, divId) {
    try {
        // Fetch the HTML content
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

        // Loop through the menus for each day and create a table
        data.MenusForDays.forEach(dayMenu => {
            const table = document.createElement('table');
            const date = new Date(dayMenu.Date);
            const dateCell = document.createElement('th');
            dateCell.textContent = date.toDateString();
            dateCell.colSpan = 2;

            // Loop through the set menus for the day
            dayMenu.SetMenus.forEach(menu => {
                const menuRow = table.insertRow();
                const menuCell = menuRow.insertCell(0);
                const menuHeader = document.createElement('th');
                menuHeader.textContent = menu.Name;
                menuCell.appendChild(menuHeader);

                // Loop through the components of the menu and add them to the row
                menu.Components.forEach(component => {
                    const componentCell = menuRow.insertCell();
                    componentCell.textContent = component;
                });
            });

            // Append the table to the arcada-lunch div
            lunchDiv.appendChild(dateCell);
            lunchDiv.appendChild(table);
        });

        // Get the food menu
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

// Call the async function to fetch and display the food menu
fetchFoodMenu('https://www.compass-group.fi/menuapi/feed/json?costNumber=3003&language=en', 'arcada-menu');
fetchFoodMenu('https://www.compass-group.fi/menuapi/feed/json?costNumber=3104&language=en', 'diak-menu');
// fetchFoodMenu('', 'chemicum-menu');
fetchFoodMenu('https://www.compass-group.fi/menuapi/feed/json?costNumber=1256&language=en', 'artebia-menu');
