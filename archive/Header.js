// components/Header.js
import React from 'react';

const Header = ({ onFillForm, isWebviewReady }) => (
  <header className="bg-[#232f3e] text-white p-4 flex justify-between items-center">
    <h1 className="m-0">ENMAX Micro-Generator Application</h1>
    <button
      onClick={onFillForm}
      disabled={!isWebviewReady}
      className={`px-4 py-2 rounded font-bold text-white ${
        isWebviewReady ? 'bg-green-500 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
      }`}
    >
      Fill the Form!
    </button>
  </header>
);


export default Header;