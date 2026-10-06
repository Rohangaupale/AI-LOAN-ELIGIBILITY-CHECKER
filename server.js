// Optional secure backend for Claude + Google Sheets integration.
// Keep API keys on the server; never put them in index.html or app.js.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.post("/api/financial-tips", async (req,res)=>{
  if(!process.env.ANTHROPIC_API_KEY)
    return res.status(503).json({error:"ANTHROPIC_API_KEY is not configured."});
  try{
    const response=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{
        "content-type":"application/json",
        "x-api-key":process.env.ANTHROPIC_API_KEY,
        "anthropic-version":"2023-06-01"
      },
      body:JSON.stringify({
        model:process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
        max_tokens:500,
        system:"You are a cautious personal-finance assistant. Give educational guidance, not guaranteed approval or regulated financial advice. Do not request sensitive account credentials.",
        messages:[{role:"user",content:`Give concise financial guidance for this profile: ${JSON.stringify(req.body)}`}]
      })
    });
    const data=await response.json();
    res.json({text:data.content?.map(x=>x.text||"").join("\n")||"No response"});
  }catch(err){res.status(500).json({error:err.message});}
});

app.listen(process.env.PORT||3000,()=>console.log("Loan checker running on http://localhost:"+ (process.env.PORT||3000)));
