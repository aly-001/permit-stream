// FormDataParser.js
import React, { useState } from 'react';

const parseCRMText = (text) => {
  console.log("=== Starting Text Parsing ===");
  console.log("Raw input text:", text);
  // Extract key information using regex patterns
  const patterns = {
    first_name: /First Name:\s*(.+?)(?:\n|$)/i,
    last_name: /Last Name:\s*(.+?)(?:\n|$)/i,
    email: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,  // Simplified to match email anywhere in text
    phone: /P:\s*\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})/i,
    consumption: /Consumption Kwh:\s*([\d,]+\.?\d*)/i,
    production: /Production kWh:\s*([\d,]+\.?\d*)/i,
    site_id: /Site ID:\s*(\d+)/i,
    est_install_date: /Est Install Date:\s*(\d{4}-\d{2}-\d{2})/i,
    postal_code: /(?:Calgary|Edmonton).*?([A-Z]\d[A-Z]\s?\d[A-Z]\d)/i
  };

  // Extract data using patterns
  const extracted = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    console.log(`Attempting to match ${key} with pattern:`, pattern);
    const match = text.match(pattern);
    console.log(`Match result for ${key}:`, match);
    
    if (match) {
      if (key === 'phone') {
        extracted[key] = match[1] + match[2] + match[3];
      } else {
        extracted[key] = match[1].trim();
      }
      console.log(`Successfully extracted ${key}:`, extracted[key]);
    } else {
      console.error(`Failed to match ${key} in text`);
      throw new Error(`Required field ${key} not found in input text`);
    }
  }

  console.log("=== Final Extracted Data ===", extracted);

  // Calculate month offset and day from installation date
  const calculateDateParams = (dateStr) => {
    console.log("Calculating date params for:", dateStr);
    try {
      const targetDate = new Date(dateStr);
      const currentDate = new Date();
      console.log("Target date:", targetDate);
      console.log("Current date:", currentDate);
      
      const monthOffset = 
        (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
        (targetDate.getMonth() - currentDate.getMonth());
      
      const result = {
        month_offset: Math.max(0, monthOffset),
        day: targetDate.getDate()
      };
      console.log("Calculated date params:", result);
      return result;
    } catch (e) {
      console.error('Error calculating date parameters:', e);
      return { month_offset: 3, day: 15 };
    }
  };

  // Convert the extracted data into the required form format
  const finalResult = {
    site_id: extracted.site_id,
    planned_date: calculateDateParams(extracted.est_install_date),
    city: "Calgary",
    postal_code: extracted.postal_code,
    current_energy_consumption: extracted.consumption.replace(/,/g, ''),
    projected_energy_production: extracted.production.replace(/,/g, ''),
    energy_source: "Solar",
    generator_type: "Synchronous",
    ac_capacity: "1.23",
    required_documents: [
      "Electrical single-line diagram",
      "Site plan",
      "Inverter specification",
      "Solar panel specifications",
      "Bidirectional meter installation acknowledgement"
    ],
    document_path: "/src/assets/images/my-image.jpg",
    contact: {
      name: `${extracted.first_name} ${extracted.last_name}`,
      phone: extracted.phone,
      email: extracted.email,
      preferred_method: "email"
    }
  };
  console.log("=== Final Parsed Result ===", finalResult);
  return finalResult;
};

const FormDataParser = ({ onDataParsed }) => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const handlePaste = async (e) => {
    console.log("=== Paste Event Triggered ===");
    const text = e.clipboardData.getData('text');
    console.log("Pasted text:", text);
    setInputText(text);
    try {
      const data = parseCRMText(text);
      console.log("Successfully parsed pasted data:", data);
      setParsedData(data);
      setError('');
      if (onDataParsed) {
        onDataParsed(data);
      }
    } catch (err) {
      console.error("Error during paste parsing:", err);
      setError('Error parsing data: ' + err.message);
      setParsedData(null);
    }
  };

  const handleChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    try {
      const data = parseCRMText(text);
      setParsedData(data);
      setError('');
      if (onDataParsed) {
        onDataParsed(data);
      }
    } catch (err) {
      setError('Error parsing data: ' + err.message);
      setParsedData(null);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Paste CRM Data:
        </label>
        <textarea
          className="w-full h-32 p-2 border rounded-md"
          value={inputText}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder="Paste CRM data here..."
        />
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {parsedData && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Data parsed successfully!
        </div>
      )}
    </div>
  );
};

export { parseCRMText };
export default FormDataParser;
