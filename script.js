document.addEventListener("DOMContentLoaded", function() {
    const menuContainer = document.getElementById('menu');

    // Fetch menu from API
    fetch('https://cafe-menu-api-ron-cada-projects.vercel.app/menu?fbclid=IwY2xjawFszkFleHRuA2FlbQIxMAABHb4RCyIyYZ0LbzjlnOpogY3GkmzXeb5Fr3o7e4V9KIgddOcgi3r2AfPmBw_aem_KTE4mhBgBWydmJtHi3zA2w')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the full API response to check the structure

            if (!data || data.length === 0) {
                throw new Error('No menu data available');
            }

            // Loop through menu items and display them
            data.forEach(item => {
                const menuItemDiv = document.createElement('div');
                menuItemDiv.classList.add('menu-item');

                // Display item ID
                const itemId = document.createElement('p');
                itemId.classList.add('menu-id');
                itemId.textContent = `ID: ${item.id}`;

                // Display item name
                const itemName = document.createElement('h3');
                itemName.textContent = item.name;

                // Display item price
                const itemPrice = document.createElement('p');
                itemPrice.classList.add('price');
                itemPrice.textContent = `Price: $${item.price}`;

                // Display item availability
                const itemAvailability = document.createElement('p');
                itemAvailability.classList.add('availability');
                itemAvailability.textContent = `Available: ${item.is_available ? 'Yes' : 'No'}`;

                // Display item category
                const itemCategory = document.createElement('p');
                itemCategory.classList.add('category');
                itemCategory.textContent = `Category: ${item.category}`;

                // Display item description
                const itemDescription = document.createElement('p');
                itemDescription.textContent = item.description;

                // Append all elements to the menu item container
                menuItemDiv.appendChild(itemId);            // Add the ID
                menuItemDiv.appendChild(itemName);          // Add the Name
                menuItemDiv.appendChild(itemPrice);         // Add the Price
                menuItemDiv.appendChild(itemAvailability);   // Add Availability
                menuItemDiv.appendChild(itemCategory);      // Add Category
                menuItemDiv.appendChild(itemDescription);   // Add Description

                // Append menu item to the menu container
                menuContainer.appendChild(menuItemDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching the menu:', error);
            menuContainer.innerHTML = '<p>Failed to load menu. Please try again later.</p>';
        });
});
