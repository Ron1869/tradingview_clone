import React from "react";
import { LanguageProvider } from 'contexts/LanguageContext';
import Routes from "./Routes";

function App() {
  return (
    <LanguageProvider>
      <Routes />
    </LanguageProvider>
  );
}

export default App;