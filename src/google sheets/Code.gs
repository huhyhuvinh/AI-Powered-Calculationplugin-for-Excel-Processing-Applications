// Show sidebar when the add-on is initialized
function onOpen(e) {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('Open AI Plugin', 'showSidebar')
    .addToUi();
}

// Show the sidebar with dynamic column headers
function showSidebar() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headerRow = 1; // Default header row; could be made configurable
  const headers = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const template = HtmlService.createTemplateFromFile('sidebar');
  template.headers = headers.filter(header => header !== ''); // Filter out empty headers
  const html = template.evaluate()
    .setTitle('AI Calculation Plugin');
  SpreadsheetApp.getUi().showSidebar(html);
}

// Process the data based on sidebar inputs
function processData(formData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headerRow = parseInt(formData.headerRow);
  const prompt = formData.prompt;
  const outputCol = formData.outputCol;
  const startRow = parseInt(formData.startRow);
  let rowCount = formData.rowCount;
  const mode = formData.mode;
  const model = formData.model;

  // Get column headers
  const headers = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Determine rows to process
  let numRows;
  if (mode === 'fixed') {
    numRows = parseInt(rowCount);
  } else {
    numRows = formData.autoRows === 'all' ? sheet.getLastRow() - startRow + 1 : parseInt(formData.autoRows);
  }

  // Get data range
  const dataRange = sheet.getRange(startRow, 1, numRows, sheet.getLastColumn());
  const data = dataRange.getValues();

  // Find output column index (1-based)
  const outputColIndex = headers.indexOf(outputCol) + 1;
  if (outputColIndex === 0) {
    SpreadsheetApp.getUi().alert('Error: Output column not found.');
    return;
  }

  // Process each row
  for (let i = 0; i < data.length; i++) {
    let rowPrompt = prompt;
    // Replace placeholders in prompt with column values
    headers.forEach((header, index) => {
      rowPrompt = rowPrompt.replace(`{{${header}}}`, data[i][index] || '');
    });
    // Call Gemini API
    const result = callAI(rowPrompt, 0.7, model);
    // Write result to output column
    sheet.getRange(startRow + i, outputColIndex).setValue(result);
  }

  SpreadsheetApp.getUi().alert('Processing Complete!')
  return "Processing Complete!"
}

// Call Gemini API
function callAI(prompt, temperature = 0.7, model = 'gemini-1.5-pro') {
  // Replace with your Gemini API key
  const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: `Just give the answer. No intro, no explanation, no markdown: ${prompt}`
      }]
    }],
    generationConfig: {
      temperature: temperature,
      maxOutputTokens: 100,
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    if (json.error) {
      throw new Error(json.error.message);
    }
    return json.candidates[0].content.parts[0].text;
  } catch (e) {
    Logger.log('Error: ' + e);
    return 'Error processing prompt: ' + e.message;
  }
}

// Custom function: GPT_SUMMARIZE
function GPT_SUMMARIZE(input, format, temperature, model) {
  // Validate inputs
  if (!input) {
    throw new Error('Text and format are required.');
  }

  const prompt = `Summarize the following text in ${format} format: ${input}`

  temperature = parseFloat(temperature) || 0.7; // Default temperature
  model = model || 'gemini-1.5-pro'; // Default Gemini model

  // Call Gemini API
  const result = callAI(prompt, temperature, model);
  return result;
}