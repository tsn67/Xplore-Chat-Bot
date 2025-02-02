
import React from "react";
import "./styles/index.css";
import ChatBot from "./components/ChatBot";


const App = () => {
  return (

   <>
        <div className="overflow-hidden h-screen w-screen grid place-content-center bg-fixed bg-red-600" style={{backgroundImage: 'url("./image 1.png")', backgroundSize: 'contain'}}>
            <ChatBot />
        </div>
   </>
 );
};

export default App;
