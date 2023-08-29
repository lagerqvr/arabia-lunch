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

// Function to fetch and display the lunch for the specific day from Arcada, Diak and Artebia 135
async function fetchLunchMajority(URL, divId) {
    try {
        // Proxy URL to bypass CORS
        const proxyURL = 'https://corsproxy.io/?'
        const fullURL = proxyURL + URL;

        // Fetch the JSON content
        const response = await fetch(fullURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Log the response status code
        // console.log('Response status code:', response.status);
        // outputError('Response status code: ' + response.status);

        const data = await response.json();
        // console.log('Fetched data:', data);

        // Get the div where you want to display the data
        const lunchDiv = document.getElementById(divId);
        lunchDiv.innerHTML = '';

        // Find today's lunch menu
        const today = new Date().toISOString().split('T')[0] + 'T00:00:00+00:00';
        const todayMenu = data.MenusForDays.find(dayMenu => dayMenu.Date === today);

        // Find current weekday
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDate = new Date();
        const day = daysOfWeek[currentDate.getDay()];
        const isWeekend = (day === 'Sat' || day === 'Sun');

        if (todayMenu && todayMenu.SetMenus && !isWeekend) {
            const lunchTime = document.createElement('div');
            switch (lunchDiv.id) {
                case 'arcada-menu':
                    lunchTime.innerHTML = `<div class="row d-flex justify-content-between">
            <div class="col-8">
                <p style="font-size: 17px"><b>Open today:</b><span
                        class="text-success"> 
                        ${todayMenu.LunchTime}</span>
                </p>
            </div>
            <div class="col-4 d-flex justify-content-end">
                <a style="text-decoration: none;" class="text-primary-emphasis menu-link"
                    href="https://www.compass-group.fi/ravintolat-ja-ruokalistat/foodco/kaupungit/helsinki/arcada/">Menu link
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor"
                        class="bi bi-box-arrow-up-right mb-1 ml-1"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                        <path fill-rule="evenodd"
                            d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                    </svg>
                </a>
            </div>
        </div>`;
                    break;
                case 'diak-menu':
                    lunchTime.innerHTML = `<div class="row d-flex justify-content-between">
            <div class="col-8">
                <p style="font-size: 17px"><b>Open today:</b><span
                        class="text-success"> 
                        ${todayMenu.LunchTime}</span>
                </p>
            </div>
            <div class="col-4 d-flex justify-content-end">
                <a style="text-decoration: none;" class="text-primary-emphasis menu-link"
                    href="https://www.compass-group.fi/ravintolat-ja-ruokalistat/foodco/kaupungit/helsinki/diak-kalasatama/">Menu link
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor"
                        class="bi bi-box-arrow-up-right mb-1 ml-1"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                        <path fill-rule="evenodd"
                            d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                    </svg>
                </a>
            </div>
        </div>`;
                    break;
                case 'artebia-menu':
                    lunchTime.innerHTML = `<div class="row d-flex justify-content-between">
            <div class="col-8">
                <p style="font-size: 17px"><b>Open today:</b><span
                        class="text-success"> 
                        ${todayMenu.LunchTime}</span>
                </p>
            </div>
            <div class="col-4 d-flex justify-content-end">
                <a style="text-decoration: none;" class="text-primary-emphasis menu-link"
                    href="https://www.compass-group.fi/ravintolat-ja-ruokalistat/foodco/kaupungit/helsinki/arabianranta/">Menu link
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor"
                        class="bi bi-box-arrow-up-right mb-1 ml-1"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                        <path fill-rule="evenodd"
                            d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                    </svg>
                </a>
            </div>
        </div>`;
                    break;
            }
            lunchDiv.appendChild(lunchTime);
            let count = 1;
            if (divId === 'artebia-menu') {
                // Remove first two items from the array
                todayMenu.SetMenus.shift();
                todayMenu.SetMenus.shift();
            }
            for (const menu of todayMenu.SetMenus) {
                if (menu.Name === null) {
                    menu.Name = 'Lunch';
                }
                const menuParagraph = document.createElement('p');
                const components = menu.Components.join(', ');
                // Add the menu name to the paragraph for DIAK
                if (divId === 'diak-menu') {
                    const menuName = menu.Name;
                    const trimmedMenuName = menuName.split(' ')[0]; // Get the first word "Vegetable"
                    const updatedMenuName = trimmedMenuName + " lunch";
                    if (updatedMenuName === 'Lunch lunch') {
                        menuParagraph.innerHTML = `<b>Lunch ${count}:</b> ${components}`;
                        lunchDiv.appendChild(menuParagraph);
                        count++;
                    } else {
                        menuParagraph.innerHTML = `<b>${updatedMenuName}:</b> ${components}`;
                        lunchDiv.appendChild(menuParagraph);
                    }
                } else {
                    if (menu.Name.includes('Veg')) {
                        menuParagraph.innerHTML = `<b>${menu.Name}:</b> ${components}`;
                        lunchDiv.appendChild(menuParagraph);
                    } else {
                        menuParagraph.innerHTML = `<b>Lunch ${count}:</b> ${components}`;
                        lunchDiv.appendChild(menuParagraph);
                        count++;
                    }
                }
            }
        } else {
            lunchDiv.innerHTML = '<p>No lunch data available for today.</p>';
        }

    } catch (error) {
        document.getElementById(divId).innerHTML = 'Failed to fetch lunch data.';
        outputError(error.message + ` (${error.stack})`);
        console.error('An error occurred:', error);
    }
};

// Function to fetch and display the lunch for the specific day from Chemicum
async function fetchChemicumLunch() {
    try {
        // Proxy URL to bypass CORS
        const proxyURL = 'https://corsproxy.io/?'
        const fullURL = proxyURL + 'https://unicafe.fi/wp-json/swiss/v1/restaurants?lang=en';

        // Fetch the JSON content
        const response = await fetch(fullURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const data = await response.json();
        // console.log('Fetched data:', data);

        const lunchData = data.find(data => data.title === 'Chemicum');

        // Find today's lunch menu
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDate = new Date();
        const day = daysOfWeek[currentDate.getDay()];
        const todayFormatted = `${day} ${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.`;

        // Match todays date with the date in the fetched data
        const todayMenu = lunchData.menuData.menus.find(menus => menus.date === todayFormatted);
        // console.log('Today\'s menu:', todayMenu);

        // Get the div where you want to display the data
        const lunchDiv = document.getElementById('chemicum-menu');
        const isWeekend = (day === 'Sat' || day === 'Sun');

        if (todayMenu && !isWeekend) {
            const lunchTime = document.createElement('div');
            lunchTime.innerHTML = `<div class="row d-flex justify-content-between">
            <div class="col-8">
                <p style="font-size: 17px"><b>Open today:</b><span
                        class="text-success"> 
                        ${lunchData.menuData.visitingHours.lounas.items[0].hours}</span>
                </p>
            </div>
            <div class="col-4 d-flex justify-content-end">
                <a style="text-decoration: none;" class="text-primary-emphasis menu-link"
                    href="https://unicafe.fi/en/restaurants/chemicum/">Menu link
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor"
                        class="bi bi-box-arrow-up-right mb-1 ml-1"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                        <path fill-rule="evenodd"
                            d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                    </svg>
                </a>
            </div>
        </div>`;
            lunchDiv.appendChild(lunchTime);
            let count = 1;
            for (const menu of todayMenu.data) {
                const menuParagraph = document.createElement('p');
                const components = menu.meta[0].join(', ');

                if (menu.price.name.includes('Veg')) {
                    menuParagraph.innerHTML = `<b>Vegan lunch: </b>${menu.name}, (${components})`;
                    lunchDiv.appendChild(menuParagraph);
                } else {
                    menuParagraph.innerHTML = `<b>Lunch ${count}: </b>${menu.name}, (${components})`;
                    lunchDiv.appendChild(menuParagraph);
                    count++;
                }
            }
        } else {
            lunchDiv.innerHTML = '<p>No lunch data available for today.</p>';
        }


    } catch (error) {
        document.getElementById('chemicum-menu').innerHTML = 'Failed to fetch lunch data.';
        outputError(error.message + ` (${error.stack})`);
        console.error('An error occurred:', error);
    }
};

const arcada = document.getElementById('arcada');
const diak = document.getElementById('diak');
const artebia = document.getElementById('artebia');
const chemicum = document.getElementById('chemicum');

arcada.addEventListener('click', function () {
    fetchLunchMajority('https://www.compass-group.fi/menuapi/feed/json?costNumber=3003&language=en', 'arcada-menu');
});

diak.addEventListener('click', function () {
    fetchLunchMajority('https://www.compass-group.fi/menuapi/feed/json?costNumber=3104&language=en', 'diak-menu');
});

artebia.addEventListener('click', function () {
    fetchLunchMajority('https://www.compass-group.fi/menuapi/feed/json?costNumber=1256&language=en', 'artebia-menu');
});

chemicum.addEventListener('click', function () {
    fetchChemicumLunch();
});

// Call the async function to fetch and display the food menu
fetchLunchMajority('https://www.compass-group.fi/menuapi/feed/json?costNumber=3003&language=en', 'arcada-menu');
fetchLunchMajority('https://www.compass-group.fi/menuapi/feed/json?costNumber=3104&language=en', 'diak-menu');
fetchLunchMajority('https://www.compass-group.fi/menuapi/feed/json?costNumber=1256&language=en', 'artebia-menu');
fetchChemicumLunch();
