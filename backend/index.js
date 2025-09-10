import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { GoogleGenerativeAI } from "@google/generative-ai";




const app =express();

app.use(cors());

app.use(express.json());




dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PORT= process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send('Hello from backend');
})

app.post('/chat',async (req,res)=>{
    try{
  const  {content} = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(content);
         res.json({ reply: result.response.text() });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API error" });
  }
});





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})