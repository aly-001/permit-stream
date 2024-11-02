// FormDataParser.js
import React, { useState } from 'react';

const parseCRMText = (contact) => {
  console.log("=== Starting Contact Parsing ===");
  console.log("Raw input contact:", contact);

  // Extract the data we need directly from the contact object
  const extracted = {
    first_name: contact.first_name || contact.display_name.split(' ')[0],
    last_name: contact.last_name || contact.display_name.split(' ')[1] || '',
    email: contact.email || 'unknown@email.com',
    phone: contact.mobile_phone || contact.home_phone || contact.work_phone || '4035551234',
    site_id: contact.jnid,
    // You might want to get these from actual fields in JobNimbus
    consumption: '1000',
    production: '800',
    est_install_date: '2024-06-15',
    postal_code: contact.zip || 'T2P1J9'
  };

  // Calculate month offset and day from installation date
  const calculateDateParams = (dateStr) => {
    try {
      const targetDate = new Date(dateStr);
      const currentDate = new Date();
      
      const monthOffset = 
        (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
        (targetDate.getMonth() - currentDate.getMonth());
      
      return {
        month_offset: Math.max(0, monthOffset),
        day: targetDate.getDate()
      };
    } catch (e) {
      console.error('Error calculating date parameters:', e);
      return { month_offset: 3, day: 15 };
    }
  };

  // Return the formatted data structure needed by the application
  const finalResult = {
    site_id: extracted.site_id,
    planned_date: calculateDateParams(extracted.est_install_date),
    city: contact.city || "Calgary",
    postal_code: extracted.postal_code,
    current_energy_consumption: extracted.consumption,
    projected_energy_production: extracted.production,
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

export { parseCRMText };
