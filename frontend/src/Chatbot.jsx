import { useState,useRef,useEffect} from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
     setInput("");

    // call backend
    const res = await axios.post("https://ai-chatbot-git-main-ak8006181716s-projects.vercel.app/chat", { content: input });

    const data = res.data;

    if (!data?.reply) {
      setMessages([...newMessages, { sender: "bot", text: "Error: No reply from server." }]);
      return;
    }

    // add bot reply
    setMessages([...newMessages, { sender: "bot", text: data.reply }]);
   
  };
  useEffect(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 p-20 flex items-center justify-center">
    <div className="p-4 w-screen mx-auto border rounded-lg shadow-md bg-white">
      <div ref={listRef} className="h-98 overflow-y-auto  mb-4 border-b p-2 no-scrollbar">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 p-2 rounded-lg ${
              m.sender === "user" ? "bg-blue-100 text-right" : "bg-gray-100"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
    <input
      className="flex-1 border p-2 rounded-lg"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // stop accidental form submission
          sendMessage();
        }
      }}
      placeholder="Type your message..."
    />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
    </div>
  );
}
