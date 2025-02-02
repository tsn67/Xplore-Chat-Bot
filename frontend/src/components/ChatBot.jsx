import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from 'axios';

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [state, setState] = useState("button");
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
     
      const response = await axios.post('https://accomplished-amazement-production.up.railway.app/chat', requestData);
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
  if (state == "button") {
    return (
      <div className="md:w-[350px] md:h-[400px] h-[80vh] w-[400px] relative flex flex-col items-center justify-end">
        <ChatBar action={setState} />
      </div>
    );
  }

  const wishWord = "Goodmorning, how can I help you?";

  return (
    <motion.div
      initial={{ height: 0, opacity: 0.5 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-[350px] h-[400px] outline outline-1 outline-[#51A8FF] bg-black/60 relative backdrop-blur-sm">
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

              <div className="flex flex-row">
                {wishWord.split("").map((char, index) => {
                  return (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0.1 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="text-white"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {char}
                    </motion.p>
                  );
                })}
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
                        <p className="text-left bg-blue-700  text-white leading-[20px] box-border py-2  rounded-sm px-2 whitespace-pre-wrap m-0">
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
                        <p className="text-left  text-white leading-[20px] box-border py-2 bg-slate-800 rounded-sm px-2 whitespace-pre-wrap m-0">
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

        <div className="h-[16%] w-full p-2 flex flex-row items-center">
          <div
            className={`flex flex-row items-center justify-between h-full w-[100%] bg-black outline outline-1 ${
              input.length !== 0 ? "outline-[#51A8FF]" : "outline-gray-400"
            }`}
          >
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              autoFocus
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendInput();
                }
              }}
              className="border-none outline-none text-white bg-transparent px-2 box-border w-4/5"
              placeholder="ask xplore ai assistant?"
            />

            <div
              onClick={() => {
                sendInput();
              }}
              className={`rounded-[2px] grid place-content-center h-[40px] w-[40px]  mr-1 ${
                input.length != 0 ? "bg-[#2282FF]" : "bg-gray-600"
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

const ChatBar = ({ action }) => {
  var gptWord = "GPT GCEK";

  return (
    <div
      onClick={() => {
        action("initial");
      }}
      className="relative"
    >
      <div className="absolute left-6 top-[25%]  text-white text-sm flex">
        <div className="flex flex-row">
          {gptWord.split("").map((char, index) => {
            return (
              <motion.p
                key={index}
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.07 }}
                className="text-white font-semibold"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {char}
              </motion.p>
            );
          })}
        </div>
      </div>
      <div className="absolute right-2 top-[5px] ">
        <motion.svg
          width="33"
          height="34"
          viewBox="0 0 33 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          <ellipse
            cx="7.75631"
            cy="0.987167"
            rx="7.75631"
            ry="0.987167"
            transform="matrix(1 0 0 -1 17.4883 17.7695)"
            fill="#FF2A6D"
          />
          <ellipse
            cx="7.75631"
            cy="0.987167"
            rx="7.75631"
            ry="0.987167"
            transform="matrix(1 0 0 -1 0 17.6777)"
            fill="#FBF840"
          />
          <ellipse
            cx="7.75631"
            cy="0.987167"
            rx="7.75631"
            ry="0.987167"
            transform="matrix(0.707107 0.707107 0.707107 -0.707107 16.4531 18.2715)"
            fill="#FBF840"
          />
          <ellipse
            cx="7.75631"
            cy="0.987167"
            rx="7.75631"
            ry="0.987167"
            transform="matrix(0 1 1 0 15.5117 0)"
            fill="#E65AFF"
          />
          <ellipse
            cx="7.75631"
            cy="0.987167"
            rx="7.75631"
            ry="0.987167"
            transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 16.4082 15.3398)"
            fill="#FF4A4A"
          />
          <ellipse
            cx="7.75631"
            cy="0.987167"
            rx="7.75631"
            ry="0.987167"
            transform="matrix(-0.707107 0.707107 0.707107 0.707107 27.4219 4.37109)"
            fill="#2282FF"
          />
          <ellipse
            cx="7.75631"
            cy="0.987167"
            rx="7.75631"
            ry="0.987167"
            transform="matrix(-0.707107 0.707107 0.707107 0.707107 15.0117 16.873)"
            fill="#FF6828"
          />
          <ellipse
            cx="7.75631"
            cy="0.987167"
            rx="7.75631"
            ry="0.987167"
            transform="matrix(0 1 1 0 15.5117 17.6777)"
            fill="#0EEB88"
          />
        </motion.svg>
      </div>
      <svg
        width="237"
        height="44"
        viewBox="0 0 237 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M236.5 43.5L0.5 43.5V22.1871L19.3679 0.499996L236.5 0.499996L236.5 22V43.5Z"
          fill="black"
          fillOpacity="0.73"
          stroke="url(#paint0_linear_373_2)"
        />

        <defs>
          <linearGradient
            id="paint0_linear_373_2"
            x1="0"
            y1="22"
            x2="237"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#51A8FF" />
            <stop offset="1" stopColor="#399CFF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
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
