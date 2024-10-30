import React, { createContext, useState, useContext } from 'react';

// Temporary contacts data
const tempContacts = [
  { 
    id: 1, 
    name: "John Doe", 
    phone: "123-456-7890",
    email: "john.doe@example.com",
    address: "123 Main St, Anytown, USA"
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    phone: "098-765-4321",
    email: "jane.smith@example.com",
    address: "456 Oak Ave, Somewhere, USA"
  },
  { 
    id: 3, 
    name: "Bob Wilson", 
    phone: "555-555-5555",
    email: "bob.wilson@example.com",
    address: "789 Pine Rd, Elsewhere, USA"
  }
];

const ContactContext = createContext();

export function ContactProvider({ children }) {
  const [contacts, setContacts] = useState(tempContacts);
  const [currentContact, setCurrentContact] = useState(tempContacts[0]);
  const [display, setDisplay] = useState('info'); // 'info' or 'form'

  return (
    <ContactContext.Provider 
      value={{ 
        contacts, 
        setContacts, 
        currentContact, 
        setCurrentContact,
        display,
        setDisplay
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