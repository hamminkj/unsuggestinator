function doGet(e) {
  const action = e.parameter.action;
  const sheet = SpreadsheetApp.openById("13G49Jn162_oR0tq-l2xwcTza5lgGvmCr6l6bsbZSqoE").getActiveSheet();

  if (action === "fetchCategories") {
    const data = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
    const categories = [...new Set(data.flat())]; // Unique categories
    return createJsonResponse({ categories });
  }

  if (action === "getRandomSuggestion") {
    const category = e.parameter.category;
    if (!category) {
      return createJsonResponse({ success: false, message: "Category parameter is required." });
    }
    const data = sheet.getDataRange().getValues();
    const suggestions = data.filter(row => row[0] === category).map(row => row[1]);
    if (suggestions.length === 0) {
      return createJsonResponse({ success: false, message: "No suggestions found for this category." });
    }
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    return createJsonResponse({ suggestion: randomSuggestion });
  }

  return createJsonResponse({ success: false, message: "Invalid action." });
}

function doPost(e) {
  const action = e.parameter.action;
  const sheet = SpreadsheetApp.openById("13G49Jn162_oR0tq-l2xwcTza5lgGvmCr6l6bsbZSqoE").getActiveSheet();
  const body = JSON.parse(e.postData.contents || "{}");

  if (action === "addCategory") {
    const category = body.category;
    if (!category) {
      return createJsonResponse({ success: false, message: "Category is required." });
    }
    sheet.appendRow([category]);
    return createJsonResponse({ success: true });
  }

  if (action === "addSuggestion") {
    const category = body.category;
    const suggestion = body.suggestion;
    if (!category || !suggestion) {
      return createJsonResponse({ success: false, message: "Category and suggestion are required." });
    }
    sheet.appendRow([category, suggestion]);
    return createJsonResponse({ success: true });
  }

  return createJsonResponse({ success: false, message: "Invalid action." });
}

// Helper function to create a JSON response with CORS headers
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}
