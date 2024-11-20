const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzedz2-vGLjcH6G5Ibds3--aPYVsoZxABJ9YkvLb7FlpI4Gihv-2tt6nOX0yCrjN-5N/exec";

const categoryDropdown = document.getElementById("category");
const newSuggestionCategoryDropdown = document.getElementById("newSuggestionCategory");
const suggestionCard = document.getElementById("suggestionCard");
const errorElement = document.getElementById("error");

// Fetch categories from the server
function fetchCategories() {
  fetch(`${WEB_APP_URL}?action=fetchCategories`)
    .then(response => response.json())
    .then(data => {
      const categories = data.categories || [];
      populateDropdown(categoryDropdown, categories);
      populateDropdown(newSuggestionCategoryDropdown, categories);
    })
    .catch(err => showError("Failed to fetch categories."));
}

// Populate dropdown options
function populateDropdown(dropdown, items) {
  dropdown.innerHTML = '<option value="">Select a category</option>';
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    dropdown.appendChild(option);
  });
}

// Show a random suggestion
function getRandomSuggestion() {
  const selectedCategory = categoryDropdown.value;
  if (!selectedCategory) {
    showError("Please select a category.");
    return;
  }
  fetch(`${WEB_APP_URL}?action=getRandomSuggestion&category=${encodeURIComponent(selectedCategory)}`)
    .then(response => response.json())
    .then(data => {
      if (data.suggestion) {
        suggestionCard.textContent = data.suggestion;
        suggestionCard.style.display = "block";
        errorElement.textContent = "";
      } else {
        showError(data.message || "No suggestions found for this category.");
      }
    })
    .catch(() => showError("Failed to get a random suggestion."));
}

// Add a new category
function addCategory() {
  const newCategory = document.getElementById("newCategory").value.trim();
  if (!newCategory) {
    showError("Category name cannot be empty.");
    return;
  }
  fetch(`${WEB_APP_URL}?action=addCategory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: newCategory })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        fetchCategories();
        document.getElementById("newCategory").value = "";
        errorElement.textContent = "";
      } else {
        showError(data.message || "Failed to add category.");
      }
    })
    .catch(() => showError("Failed to add category."));
}

// Add a new suggestion
function addSuggestion() {
  const newSuggestion = document.getElementById("newSuggestion").value.trim();
  const selectedCategory = newSuggestionCategoryDropdown.value;
  if (!newSuggestion || !selectedCategory) {
    showError("Please enter a suggestion and select a category.");
    return;
  }
  fetch(`${WEB_APP_URL}?action=addSuggestion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ suggestion: newSuggestion, category: selectedCategory })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById("newSuggestion").value = "";
        errorElement.textContent = "";
      } else {
        showError(data.message || "Failed to add suggestion.");
      }
    })
    .catch(() => showError("Failed to add suggestion."));
}

// Display error messages
function showError(message) {
  errorElement.textContent = message;
}

// Initial fetch of categories
fetchCategories();
