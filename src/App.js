import React, { useRef, useEffect, useState } from "react";
import { useFormAutomation } from "./hooks/useFormAutomation";
import FormDataParser, { parseCRMText } from "./formDataParser"; // Add this import
import JobNimbusService from "./services/JobNimbusService";
// function App() {
//   const webviewRef = useRef(null);
//   const [isWebviewReady, setIsWebviewReady] = useState(false);
//   const [formData, setFormData] = useState(null);
//   const { fillForm } = useFormAutomation(webviewRef, isWebviewReady, formData);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Setup webview event handlers
//   useEffect(() => {
//     if (webviewRef.current) {
//       webviewRef.current.addEventListener("dom-ready", () => {
//         console.log("Webview DOM ready");
//         setIsWebviewReady(true);
//       });
//     }
//   }, []);

//   const handleDataParsed = (data) => {
//     setFormData(data);
//   };

//   const handleFillForm = () => {
//     fillForm(); // No need to pass formData here, the hook already has it
//   };

//   const handleDataSubmit = (event) => {
//     event.preventDefault();
//     const rawText = event.target.textData.value;
//     try {
//       const parsedData = parseCRMText(rawText);  // Parse the raw text first
//       handleDataParsed(parsedData);  // Pass the parsed data
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error parsing data:", error);
//       // You might want to show an error message to the user here
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         margin: 0,
//         padding: 0,
//       }}
//     >
//       <header
//         style={{
//           backgroundColor: "#232f3e",
//           color: "white",
//           padding: "10px",
//           textAlign: "center",
//           margin: 0,
//         }}
//       >
//         <h1 style={{ margin: 0 }}>ENMAX Micro-Generator Application</h1>
//       </header>

//       <div
//         style={{
//           display: "flex",
//           padding: "10px",
//           backgroundColor: "#f5f5f5",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <button
//           onClick={() => setIsModalOpen(true)}
//           style={{
//             padding: "8px 16px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontSize: "16px",
//             fontWeight: "bold",
//           }}
//         >
//           Upload Data
//         </button>
//         <button
//           onClick={handleFillForm}
//           disabled={!isWebviewReady || !formData}
//           style={{
//             padding: "8px 16px",
//             backgroundColor: isWebviewReady && formData ? "#4CAF50" : "#cccccc",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: isWebviewReady && formData ? "pointer" : "not-allowed",
//             fontSize: "16px",
//             fontWeight: "bold",
//             marginLeft: "10px",
//           }}
//         >
//           {formData ? "Fill Form with Data" : "Paste Data First"}
//         </button>
//       </div>

//       {isModalOpen && (
//         <div style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           zIndex: 1000,
//         }}>
//           <div style={{
//             backgroundColor: "white",
//             padding: "20px",
//             borderRadius: "8px",
//             width: "80%",
//             maxWidth: "800px",
//             maxHeight: "80vh",
//             display: "flex",
//             flexDirection: "column",
//           }}>
//             <h2 style={{ marginTop: 0 }}>Paste Data</h2>
//             <form onSubmit={handleDataSubmit}>
//               <textarea
//                 name="textData"
//                 style={{
//                   width: "100%",
//                   height: "300px",
//                   marginBottom: "20px",
//                   padding: "10px",
//                   fontSize: "14px",
//                   border: "1px solid #ccc",
//                   borderRadius: "4px",
//                   resize: "vertical",
//                 }}
//                 placeholder="Paste your data here..."
//               />
//               <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   style={{
//                     padding: "8px 16px",
//                     backgroundColor: "#6c757d",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "4px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   style={{
//                     padding: "8px 16px",
//                     backgroundColor: "#28a745",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "4px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//         }}
//       >
//         <webview
//           ref={webviewRef}
//           src="https://www.enmax.com/helping-power-your-project/start-a-project/connect-a-micro-generator"
//           style={{
//             flex: 1,
//             border: "none",
//             margin: 0,
//             padding: 0,
//           }}
//           nodeintegration="true"
//           webpreferences="contextIsolation=false"
//         ></webview>
//       </div>
//     </div>
//   );
// }

import ContactSelector from "./archive/ContactSelector";
import MainScreen from "./screens/Main";

function App() {
  return (
    <div>
      <MainScreen />
    </div>
  );
}

export default App;


// import JobNimbusFileDownloader from "./random/JobNimbusFileDownloader";
// function App() {
//   return (
//     <div>
//       <JobNimbusFileDownloader />
//     </div>
//   );
// }

// export default App;