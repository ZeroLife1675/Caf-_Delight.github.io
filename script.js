// Move these functions to the global scope
async function fetchMenu() {
    const menuContainer = document.getElementById('menu');
    
    try {
        const response = await fetch('https://cafe-menu-api-ron-cada-projects.vercel.app/menu');
        const data = await response.json();
        menuContainer.innerHTML = '';  // Clear existing content

        if (!data || data.length === 0) {
            menuContainer.innerHTML = '<p>No menu data available</p>';
            return;
        }

        // Display each item
        data.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            
            const itemId = document.createElement('p');
            itemId.textContent = `ID: ${item.id}`;
            
            const itemName = document.createElement('h3');
            itemName.textContent = item.name;
            
            const itemPrice = document.createElement('p');
            itemPrice.classList.add('price');
            itemPrice.textContent = `Price: $${item.price}`;
            
            const itemCategory = document.createElement('p');
            itemCategory.textContent = `Category: ${item.category}`;
            
            const itemDescription = document.createElement('p');
            itemDescription.textContent = item.description;
            
            // Create Edit button with icon and text
            const editIcon = document.createElement('button');
            editIcon.innerHTML = '<i class="fa fa-pencil"></i> Edit';
            editIcon.onclick = () => {
                showEditForm(item);
            };
            
            // Create Delete button with icon and text
            const deleteIcon = document.createElement('button');
            deleteIcon.innerHTML = '<i class="fa fa-trash"></i> Delete';
            deleteIcon.onclick = () => deleteItem(item.id);
            
            // Append everything to menuItemDiv
            menuItemDiv.appendChild(itemId);
            menuItemDiv.appendChild(itemName);
            menuItemDiv.appendChild(itemPrice);
            menuItemDiv.appendChild(itemCategory);
            menuItemDiv.appendChild(itemDescription);
            menuItemDiv.appendChild(editIcon);
            menuItemDiv.appendChild(deleteIcon);
            
            // Append the menu item to the container
            menuContainer.appendChild(menuItemDiv);
        });
    } catch (error) {
        console.error('Error fetching the menu:', error);
        menuContainer.innerHTML = '<p>Failed to load menu. Please try again later.</p>';
    }
}

// Function to update a menu item
async function updateItem() {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value.trim();
    const price = parseFloat(document.getElementById('edit-price').value);
    const category = document.getElementById('edit-category').value.trim();
    const description = document.getElementById('edit-description').value.trim();

    // Validates input
    if (!name || isNaN(price) || price < 0 || !category || !description) {
        alert('Please fill in all the fields correctly.');
        return; // Stop execution if validation fails
    }

    // Debugging output
    console.log('Updating item with data:', {
        id: id,
        name: name,
        price: price,
        category: category,
        description: description
    });

    try {
        const response = await fetch(`https://cafe-menu-api-ron-cada-projects.vercel.app/menu/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                name: name,
                price: price,
                category: category,
                description: description,
                is_available: true  // Optional, set default or retain the value
            })
        });

        if (!response.ok) {
            const errorData = await response.json(); // Capture error response
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || ''}`);
        }

        const data = await response.json();
        console.log('Item updated:', data);

        // Refresh the menu and close the edit form
        fetchMenu();
        closeEditForm();
    } catch (error) {
        console.error('Error updating item:', error);
        alert(`Error updating item: ${error.message}`); // Alert the user about the error
    }
}


// Function to close the edit form
function closeEditForm() {
    const editForm = document.querySelector('.edit-form');
    if (editForm) {
        console.log('Closing edit form');  // Debug message to check if this is called
        editForm.remove();  // Remove the form
    }
}

// Function to show the edit form in a modal
function showEditForm(item) {
    // Set values in the edit form
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-price').value = item.price;
    document.getElementById('edit-category').value = item.category;
    document.getElementById('edit-description').value = item.description;

    // Display the modal
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'block'; // Show the modal
}

// Function to close the edit form
function closeEditForm() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none'; // Hide the modal
}

// Function to delete a menu item
async function deleteItem(id) {
    try {
        const response = await fetch(`https://cafe-menu-api-ron-cada-projects.vercel.app/menu/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Item deleted:', data);
        fetchMenu(); // Refresh the menu after deletion
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Fetch and display the menu on page load
    fetchMenu();

    // Create a new menu item (POST)
    document.getElementById('create-btn').addEventListener('click', async function () {
        const id = document.getElementById('item-id').value; // Optional, depending on your API
        const name = document.getElementById('item-name').value;
        const price = parseFloat(document.getElementById('item-price').value);
        const category = document.getElementById('item-category').value;
        const description = document.getElementById('item-description').value;
    
        // Validate inputs
        if (isNaN(id) || !name || !category || !description || isNaN(price) || price < 0) {
            console.error('Invalid input data');
            alert('Please fill in all fields correctly.');
            return; // Stop execution if validation fails
        }
    
        try {
            const response = await fetch('https://cafe-menu-api-ron-cada-projects.vercel.app/menu', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,  // Not needed if auto-generated by the server
                    name: name,
                    price: price,  // Ensure this is a number
                    category: category,
                    description: description,
                    is_available: true // Default to true
                })
            });
            if (!response.ok) {
                const errorData = await response.json(); // Capture the error message from the server
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || ''}`);
            }
            const data = await response.json();
            console.log('Item created:', data);
            fetchMenu(); // Refresh the menu after creation
        } catch (error) {
            console.error('Error creating item:', error);
            alert(`Error creating item: ${error.message}`); // Alert the user about the error
        }
    });
    //Search By ID function
    document.getElementById('search-btn').addEventListener('click', function () {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');
    
        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            if (itemName.includes(searchInput)) {
                item.style.display = ''; // Show the item
            } else {
                item.style.display = 'none'; // Hide the item
            }
        });
    });
    
});

