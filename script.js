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

        console.log('Fetching data...');
        document.getElementById(divId).innerHTML = '<p>Fetching data...</p>';

        const data = await response.json();
        console.log('Data fetched:', data);

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
