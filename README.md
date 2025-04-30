# -AI-Powered-Calculationplugin-for-Excel-Processing-Applications

## Overview
The AI Calculation Plugin is a Google Sheets add-on that leverages the Gemini API to process and generate text based on user-defined prompts. It allows users to perform tasks such as summarizing text or generating content directly within a Google Sheet. The plugin provides a user-friendly sidebar interface to configure and run AI operations on selected rows, as well as a custom function `GPT_SUMMARIZE()` for use in individual cells.

## Features
- **Sidebar Interface**: Configure and run AI operations on multiple rows using a dynamic sidebar.
- **Custom Function**: Use the `=GPT_SUMMARIZE()` function in a cell to summarize text with customizable formats, temperature, and model.
- **Dynamic Prompting**: Use placeholders in prompts (e.g., `{{ColumnName}}`) to dynamically insert column values for each row.
- **Model Selection**: Choose between Gemini models (e.g., "gemini-1.5-pro" or "gemini-2.0-flash") via the sidebar.
- **Flexible Row Processing**: Process a specific number of rows, all rows, or a fixed range of rows.

## Installation
1. **Open Google Sheets**:
   - Create or open a Google Sheet where you want to use the plugin.

2. **Access Apps Script**:
   - Go to **Extensions > Apps Script** in the Google Sheets menu.

3. **Set Up the Project**:
   - In the Apps Script editor, copy and paste the contents of `Code.gs` and `Sidebar.html` into their respective files.
   - Create a new script file named `Code.gs` if it doesn't exist, and paste the provided code.
   - Create a new HTML file named `sidebar.html` and paste the provided code.

4. **Set Your API Key**:
   - In `Code.gs`, locate the line:
     ```javascript
     const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
     ```
   - Set your Gemini API key in the Apps Script properties:
     - Go to **Project Settings > Script Properties** in the Apps Script editor.
     - Add a new property with the key `API_KEY` and your Gemini API key as the value.
     - Alternatively, you can hardcode your API key directly in the code (not recommended for security reasons):
       ```javascript
       const apiKey = 'your-gemini-api-key-here';
       ```

5. **Save and Authorize**:
   - Save the project by clicking the **Save** button.
   - Run the `onOpen` function manually to trigger authorization prompts.
   - Grant the necessary permissions for the script to access Google Sheets and make external API requests.

6. **Deploy as a Test Add-On (Optional)**:
   - To use the plugin as an add-on, click **Deploy > Test Deployments** in the Apps Script editor.
   - Create a new test deployment and follow the instructions to install the add-on in your Google Sheet.

## Usage

### Using the Sidebar
1. **Open the Sidebar**:
   - After installation, reload your Google Sheet.
   - Go to **Extensions > AI Calculation Plugin > Open AI Plugin** to open the sidebar.

2. **Configure the Sidebar**:
   - **Header Row**: Specify the row containing your column headers (default is 1).
   - **Prompt to Run for Each Row**: Enter a prompt using placeholders like `{{ColumnName}}` to dynamically insert column values (e.g., `Summarize {{Description}}`).
   - **Output Column**: Select the column where the AI-generated results will be written (must match a header).
   - **Model**: Choose the Gemini model to use (e.g., "Gemini 2.0 flash" or "Gemini 1.5 pro").
   - **Start from Row**:
     - **Auto Mode**: Process a specific number of rows or all rows starting from row 2.
     - **Fixed Mode**: Specify a start and end row to process a fixed range.

3. **Run the Operation**:
   - Click the **Run** button (e.g., "Run 3 rows") to process the specified rows.
   - Results will be written to the selected output column for each processed row.
   - A confirmation alert will appear when processing is complete.

### Using the Custom Function
1. **In a Cell**:
   - Use the `=GPT_SUMMARIZE()` function in a cell with the following syntax:
     ```
     =GPT_SUMMARIZE(input, format, temperature, model)
     ```
     - `input`: The text to process (e.g., a cell reference like `A2` or a string like `"Some text"`).
     - `format`: The desired format for the summary (e.g., `"bullet points"` or `"one sentence"`).
     - `temperature` (optional): A number between 0 and 1 to control randomness (default is 0.7).
     - `model` (optional): The Gemini model to use (e.g., `"gemini-1.5-pro"`, default is "gemini-1.5-pro").
   - Example:
     ```
     =GPT_SUMMARIZE(A2, "bullet points", 0.7, "gemini-1.5-pro")
     ```
     This will summarize the text in cell A2 in bullet point format using the "gemini-1.5-pro" model.

2. **Note on Custom Function in Deployed Add-On**:
   - If you deploy this as an add-on, the custom function may not work immediately due to context issues.
   - Ensure the add-on is installed in the spreadsheet (via the test deployment link) and authorized.
   - If the function shows as "Unknown function," use the sidebar instead or run the script manually to initialize it.

## Example
### Sample Data
![Example Image 1](https://raw.githubusercontent.com/huhyhuvinh/AI-Powered-Calculationplugin-for-Excel-Processing-Applications/main/img/image1.png)

### Using the Sidebar
- Open the sidebar and configure:
  - Header Row: 1
  - Prompt: `You are an expert in the digital marketing. You are responsible for generating product name from {{Description}}`
  - Output Column: Product Name
  - Model: Gemini 2.0 flash
  - Start from row: Auto, 3 rows
- Click "Run 3 rows".
- The "Product Name" column will be populated with product name of the "Description" column.

### Result
![Example Image 2](https://raw.githubusercontent.com/huhyhuvinh/AI-Powered-Calculationplugin-for-Excel-Processing-Applications/main/img/image2.png)

### Using the Custom Function
- In cell D2, enter:
  ```
  =GPT_SUMMARIZE(B2, "Item list", 0, "gemini-1.5-pro")
  ```
- This will summarize the text in B2 (e.g., "Stay hydrated with the EcoSip Water Bottle...") in list.
![Example Image 3](https://raw.githubusercontent.com/huhyhuvinh/AI-Powered-Calculationplugin-for-Excel-Processing-Applications/main/img/image3.png)

### Result
![Example Image 4](https://raw.githubusercontent.com/huhyhuvinh/AI-Powered-Calculationplugin-for-Excel-Processing-Applications/main/img/image4.png)
