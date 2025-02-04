import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from 'axios';

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [state, setState] = useState("initial");
  const [messages, setMessages] = useState([]); //format [{type: 'user', msg: 'hello'}, {type: 'system', msg: 'hello hai'}]

  function formatMessage(msg) {
    
    const boldPattern = /\*\*(.*?)\*\*/g;
    const heavy = /\#\#\#\ (.*?)/g; 
    const semiBoldPattern = /\*(.*?)\*/g; 
    
    let formattedMsg = msg;
    let elements = [];
    let lastIndex = 0;
  
    msg.replace(
      /(\*\*.*?\*\*|\*.*?\* \w+)/g,
      (match, captured, index) => {
        
        if (index > lastIndex) {
          elements.push(msg.slice(lastIndex, index));
        }
  
        if (match.startsWith("**")) {
          
          elements.push(
            <span key={index} className="text-yellow-200">
              {match.replace(/\*\*/g, "")}
            </span>
          );
        } else if (match.startsWith("*")) {

          elements.push(
            <span key={index} className="text-yellow-100">
              {match.replace(/\*/g, "")}
            </span>
          );
        } 
        
        else if(match.startsWith('###')) {
          elements.push(
            <span key={index} className="text-blue-500">
              {match.replace("###", "")}
            </span>
          );
        }
  
        lastIndex = index + match.length;
        return match;
      }
    );
  
    
    if (lastIndex < msg.length) {
      elements.push(msg.slice(lastIndex));
    }
  
    return elements;
  }
  

  async function chatAi() {
    
    const requestData = {
      userInput: input,
      sessionId: '123',
      userHistory: messages,
    };

    try {
      
      // remote backend = https://xplore-chat-bot-production.up.railway.app/chat
      const response = await axios.post('https://xplore-chat-bot-production.up.railway.app/chat', requestData);
      //console.log(response);
      return response.data.response;
      
    } catch (err) {
      console.log(err);
    } finally {
      
    }

  }
  
  async function sendInput() {
    if (state === "loading") return; 
    setInput(""); 
    if (state !== "chat") setState("chat"); 
  
    setMessages((prev) => [...prev, { type: "user", msg: input }]); 
    setState("loading"); 
  
    
    const aiMessage = await chatAi();
    setState('chat');
   
    setMessages((prev) => [...prev, { type: "system", msg: aiMessage }]);
  
  }
  

  const wishWord = "Hello there, welcome to xplore24 chatbot, how can I help you?";

  return (
    <motion.div
      initial={{ height: 0, opacity: 0.5 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-[350px] h-[85vh] h-min-[40vh] flex flex-col overflow-hidden justify-between  lg:w-[60vw] lg:h-[90vh] rounded-[10px]  bg-[#0D0B0B] outline outline-1 outline-[#393B41] relative backdrop-blur-sm">
        {state == "initial" && (
          <div className="h-[84%] w-[100%] grid place-content-center">
            <div className="flex flex-col items-center justify-center">
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ ease: "linear", duration: 10, repeat: Infinity }}
                width="120"
                height="121"
                viewBox="0 0 120 121"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="28.2048"
                  cy="3.5897"
                  rx="28.2048"
                  ry="3.5897"
                  transform="matrix(1 0 0 -1 63.5898 64.6172)"
                  fill="#FBF840"
                />
                <ellipse
                  cx="28.2048"
                  cy="3.5897"
                  rx="28.2048"
                  ry="3.5897"
                  transform="matrix(1 0 0 -1 0 64.2773)"
                  fill="#FBF840"
                />
                <ellipse
                  cx="28.2048"
                  cy="3.5897"
                  rx="28.2048"
                  ry="3.5897"
                  transform="matrix(0.707107 0.707107 0.707107 -0.707107 59.8281 66.4375)"
                  fill="#4CCA72"
                />
                <ellipse
                  cx="28.2048"
                  cy="3.5897"
                  rx="28.2048"
                  ry="3.5897"
                  transform="matrix(0 1 1 0 56.4082 -0.00195312)"
                  fill="#5349C2"
                />
                <ellipse
                  cx="28.2048"
                  cy="3.5897"
                  rx="28.2048"
                  ry="3.5897"
                  transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 59.666 55.7812)"
                  fill="#4CCA72"
                />
                <ellipse
                  cx="28.2048"
                  cy="3.5897"
                  rx="28.2048"
                  ry="3.5897"
                  transform="matrix(-0.707107 0.707107 0.707107 0.707107 99.7148 15.8965)"
                  fill="#FF2C2C"
                />
                <ellipse
                  cx="28.2048"
                  cy="3.5897"
                  rx="28.2048"
                  ry="3.5897"
                  transform="matrix(-0.707107 0.707107 0.707107 0.707107 54.5859 61.3574)"
                  fill="#FF2C2C"
                />
                <ellipse
                  cx="28.2048"
                  cy="3.5897"
                  rx="28.2048"
                  ry="3.5897"
                  transform="matrix(0 1 1 0 56.4082 64.2773)"
                  fill="#5349C2"
                />
              </motion.svg>

              <div className="w-[80px] h-[80px]">
                <img src="./logo.png" alt="xplore24 logo" />
              </div>


              <div className="w-[320px] lg:w-[510px]">
                <div className="flex flex-row flex-wrap justify-center">
                {wishWord.split("").map((char, index) => {
                  return (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0.1 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={`lg:text-[18px] ${index > 22  && index < 40?"text-orange-500 font-normal ":"text-white font-light"}`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {char}
                    </motion.p>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        )}

        {(state === "chat" || state === "loading") && (
          <div className="h-[84%] w-full flex flex-col items-center overflow-y-auto">
            <div className="w-full box-border p-2 mt-2 flex flex-col">
              {messages.map((item, index) => {
                if (item.type === "user") {
                  return (
                    <motion.div
                      initial={{ opacity: 0.6, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={(2 * index)}
                      className="w-full flex justify-end mb-2 pr-[10px]"
                    >
                      <div className="rounded-sm px-1 max-w-[85%]">
                        <p className="text-left lg:text-[17px] rounded-lg bg-blue-700  text-white leading-[20px] box-border py-2  px-2 whitespace-pre-wrap m-0">
                          {item.msg}
                        </p>
                      </div>
                    </motion.div>
                  );
                } else {
                  return (
                    <motion.div
                      initial={{ opacity: 0.6, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={(2 * index) + 1}
                      className="w-full flex justify-start mb-2 pl-[10px]"
                    >
                      <div className="bg-white-500 rounded-sm px-1 max-w-[85%] break-words">
                        <p className="text-left lg:text-[17px] rounded-lg text-white leading-[20px] box-border py-2 bg-slate-800 rounded-sm px-2 whitespace-pre-wrap m-0">
                          {formatMessage(item.msg)}
                        </p>
                      </div>
                    </motion.div>
                  )
                }
              })}

              {state == "loading" && (
                <motion.div
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  className="flex flex-row justify-start gap-1 items-center"
                >
                  <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{
                      ease: "linear",
                      duration: 6,
                      repeat: Infinity,
                    }}
                    width="27"
                    height="28"
                    viewBox="0 0 27 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse
                      cx="6.3459"
                      cy="0.80766"
                      rx="6.3459"
                      ry="0.80766"
                      transform="matrix(1 0 0 -1 14.3086 14.5723)"
                      fill="#FF2A6D"
                    />
                    <ellipse
                      cx="6.3459"
                      cy="0.80766"
                      rx="6.3459"
                      ry="0.80766"
                      transform="matrix(1 0 0 -1 0 14.498)"
                      fill="#FBF840"
                    />
                    <ellipse
                      cx="6.3459"
                      cy="0.80766"
                      rx="6.3459"
                      ry="0.80766"
                      transform="matrix(0.707107 0.707107 0.707107 -0.707107 13.4609 14.9824)"
                      fill="#FBF840"
                    />
                    <ellipse
                      cx="6.3459"
                      cy="0.80766"
                      rx="6.3459"
                      ry="0.80766"
                      transform="matrix(0 1 1 0 12.6914 0.0332031)"
                      fill="#E65AFF"
                    />
                    <ellipse
                      cx="6.3459"
                      cy="0.80766"
                      rx="6.3459"
                      ry="0.80766"
                      transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 13.4258 12.584)"
                      fill="#FF4A4A"
                    />
                    <ellipse
                      cx="6.3459"
                      cy="0.80766"
                      rx="6.3459"
                      ry="0.80766"
                      transform="matrix(-0.707107 0.707107 0.707107 0.707107 22.4355 3.60938)"
                      fill="#2282FF"
                    />
                    <ellipse
                      cx="6.3459"
                      cy="0.80766"
                      rx="6.3459"
                      ry="0.80766"
                      transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.2832 13.8398)"
                      fill="#FF6828"
                    />
                    <ellipse
                      cx="6.3459"
                      cy="0.80766"
                      rx="6.3459"
                      ry="0.80766"
                      transform="matrix(0 1 1 0 12.6914 14.498)"
                      fill="#0EEB88"
                    />
                  </motion.svg>

                  <ChatbotLoading />
                  
                </motion.div>
              )}
            </div>
          </div>
        )}

        <div className="h-[16%] max-h-[80px] w-full p-2 flex flex-row items-center">
          <div
            className={`flex flex-row items-center justify-between h-full w-[100%] bg-[#15181C] outline outline-1 rounded-[12px] ${
              input.length !== 0 ? "outline-blue-900" : "outline-gray-700"
            }`}
          >
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              autoFocus
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if(input.trim().length == 0) return;
                  sendInput();
                }
              }}
              className="border-none outline-none lg:text-[19px] text-white bg-transparent px-[10px] lg:w-[90%] h-[90%] box-border w-4/5"
              placeholder="ask xplore24 chat bot"
            />

            <div
              onClick={() => {
                if(input.trim().length == 0) return;
                sendInput();
              }}
              className={`rounded-[10px] grid place-content-center h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] pl-[5px] mr-2 lg:mr-2 ${
                input.length != 0 ? "bg-blue-700" : "bg-[#333437]"
              }`}
            >
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 21V0L20 10.5L0 21ZM2.10526 17.0625L14.5789 10.5L2.10526 3.9375V8.53125L8.42105 10.5L2.10526 12.4688V17.0625Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};



const ChatbotLoading = () => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const circleVariants = {
    initial: {
      scale: 0.8,
      opacity: 0.5
    },
    animate: {
      
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div 
      className="flex items-center justify-center gap-1 p-1"
      variants={containerVariants}
      animate="animate"
    >
      <motion.div 
        className="w-2 h-2 bg-blue-500 rounded-full"
        variants={circleVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="w-2 h-2 bg-blue-600 rounded-full"
        variants={circleVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="w-2 h-2 bg-blue-700 rounded-full"
        variants={circleVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="w-2 h-2 bg-blue-800 rounded-full"
        variants={circleVariants}
        initial="initial"
        animate="animate"
      />
    </motion.div>
  );
};

export default ChatBot;
