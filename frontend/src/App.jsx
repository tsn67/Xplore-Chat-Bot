
import React from "react";
import "./styles/index.css";
import ChatBot from "./components/ChatBot";


const App = () => {
  return (

   <>
        <div className="overflow-hidden h-screen w-screen grid place-content-center " style={{background: '#1E1E1E'}}>
            <ChatBot />
        </div>
   </>
 );
};

export default App;
