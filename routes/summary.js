import OpenAI from 'openai';
import express, { text } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path:path.resolve(__dirname,'../.env')});

const router =express.Router();

const client = new OpenAI({
    baseURL:'https://api.deepseek.com',
    apiKey:process.env.OPENAI_API_KEY,
});

 const generateSummary = async(text,maxlength = 200) =>{
    const systemPrompt = `你是一个专业的文章摘要专家，你的任务是：
    提取文章的核心观点、保持原文的逻辑结构、使用精炼的语言、确保摘要的完整性和准确性。`;

   const userPrompt = `请为以下文章生成一个${maxlength}字以内的摘要，要求简洁明了，
   保留关键信息：${text}摘要：`;

   const completion = await client.chat.completions.create({
    model:"deepseek-chat",
    messages:[
        {role:"system",content:systemPrompt},
        {role:"user",content:userPrompt},
    ],
    temperature:0.3,
    max_tokens:Math.min(maxlength*2,500),
    top_p:0.9,
   });

   return completion.choices[0].message.content.trim();
 };


 router.post('/',async(req,res)=>{
    try{
        const {text,maxlength=200} = req.body;
        
        if(!text || text.trim().length === 0){
            return res.status(400).json({
                success:false,
                message:"文章加载失败"
            });
        }

        const summary = await generateSummary(text,maxlength);

        let processSummary = summary;
        if(summary.length>maxlength){
            processSummary = summary.substring(0,maxlength);
            const punctuations = ['，','。','？','!','；',',','.','?',';'];
            for(const punc of punctuations){
                const lastIndex = processSummary.lastIndexOf(punc);
                if(lastIndex >maxlength*0.7){
                    processSummary = processSummary.substring(0,lastIndex);
                    break;
                }
            }
        }

        res.json({
            success:true,
            data:{
                summary:processSummary,
                metadata:{
                    originlength:text.length,
                    summarylength:summary.length,
                    processSummarylength:processSummary.length,
                }
            }
        });
    }catch(error){
        console.error("摘要生成错误：",error);

    }
 });

 export default router;