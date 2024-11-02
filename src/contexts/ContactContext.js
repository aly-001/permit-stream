import React, { createContext, useState, useContext, useEffect } from 'react';
import JobNimbusService from '../services/JobNimbusService';

const ContactContext = createContext();

const processContact = async (rawContact, jobNimbusService) => {
  // Calculate month offset and day from estimated install date
  const calculatePlannedDate = (timestamp) => {
    if (!timestamp) return { month_offset: 3, day: 15 }; // Default values if no timestamp

    const currentDate = new Date();
    const installDate = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds

    // Calculate months between dates
    let monthOffset = (installDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                     (installDate.getMonth() - currentDate.getMonth());
    
    // If monthOffset is negative, default to 3
    monthOffset = monthOffset < 0 ? 3 : monthOffset;

    return {
      month_offset: monthOffset,
      day: installDate.getDate()
    };
  };

  const plannedDate = calculatePlannedDate(rawContact['Est Install Date'] || rawContact.cf_date_1);

  try {
    // Fetch and process documents
    const documentsResponse = await jobNimbusService.getContactDocuments(rawContact.recid);
    const documents = [];

    if (documentsResponse && documentsResponse.files) {
      for (const doc of documentsResponse.files) {
        try {
          const filePath = await jobNimbusService.downloadDocument(doc.jnid, doc.filename);
          documents.push({
            filename: doc.filename,
            downloadUrl: `file://${filePath}`,
            contentType: doc.content_type,
            localPath: filePath
          });
        } catch (error) {
          console.error(`Error processing document ${doc.filename}:`, error);
        }
      }
    }

    return {
      id: rawContact.recid,
      site_id: rawContact.Site_ID || rawContact.cf_string_11 || "",
      planned_date: plannedDate,
      city: rawContact.city || "cat",
      postal_code: rawContact.zip || "cat",
      current_energy_consumption: rawContact.Consumption_Kwh?.toString() || rawContact.cf_double_2?.toString() || "",
      projected_energy_production: rawContact.Production_kWh?.toString() || rawContact.cf_double_3?.toString() || "",
      energy_source: "Solar",
      generator_type: "Synchronous",
      ac_capacity: rawContact.KW_DC?.toString() || rawContact.cf_double_4?.toString() || "",
      required_documents: [
        "Electrical single-line diagram",
        "Site plan",
        "Inverter specification",
        "Solar panel specifications",
        "Bidirectional meter installation acknowledgement",
      ],
      documents: documents,
      contact: {
        name: rawContact.display_name || "cat",
        phone: rawContact.home_phone || rawContact.mobile_phone || rawContact.work_phone || "",
        email: rawContact.email || "cat",
        preferred_method: "email",
      },
    };
  } catch (error) {
    console.error('Error processing contact:', error);
    return {
      id: rawContact.recid,
      site_id: rawContact.Site_ID || rawContact.cf_string_11 || "",
      planned_date: plannedDate,
      city: rawContact.city || "cat",
      postal_code: rawContact.zip || "cat",
      current_energy_consumption: rawContact.Consumption_Kwh?.toString() || rawContact.cf_double_2?.toString() || "",
      projected_energy_production: rawContact.Production_kWh?.toString() || rawContact.cf_double_3?.toString() || "",
      energy_source: "Solar",
      generator_type: "Synchronous",
      ac_capacity: rawContact.KW_DC?.toString() || rawContact.cf_double_4?.toString() || "",
      required_documents: [
        "Electrical single-line diagram",
        "Site plan",
        "Inverter specification",
        "Solar panel specifications",
        "Bidirectional meter installation acknowledgement",
      ],
      documents: [],
      contact: {
        name: rawContact.display_name || "cat",
        phone: rawContact.home_phone || rawContact.mobile_phone || rawContact.work_phone || "",
        email: rawContact.email || "cat",
        preferred_method: "email",
      },
    };
  }
};

export function ContactProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [display, setDisplay] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  const jobNimbusService = new JobNimbusService("m2ud7n7j67nzk6x0");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await jobNimbusService.getContacts();
        
        console.log('Raw Contact Data:', response.results);

        const contactsData = await Promise.all(
          response.results.map(contact => processContact(contact, jobNimbusService))
        );

        const sortedContacts = contactsData.sort((a, b) => b.date_created - a.date_created);
        setContacts(sortedContacts);
        setFilteredContacts(sortedContacts);
        setCurrentContact(sortedContacts[0]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact => 
      contact.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  return (
    <ContactContext.Provider 
      value={{ 
        contacts,
        filteredContacts,
        setContacts, 
        currentContact, 
        setCurrentContact,
        display,
        setDisplay,
        loading,
        error,
        searchTerm,
        setSearchTerm
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}