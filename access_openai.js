import OpenAI from 'openai';
import readline from 'readline';
import dotenv from 'dotenv';


dotenv.config()

const client = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey:process.env.OPENAI_API_KEY,
});

const shell = readline.createInterface({
    input :process.stdin,
    output:process.stdout,
})

async function chatwithclient(input){
    try{
        const res = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: input }],
    });
     return res.choices[0].message.content;
    }catch(error){
        console.error("error",error);
        return;
    }
}



shell.prompt(':')
shell.on('line',async(input)=>{
    console.log(await chatwithclient(input))
    shell.prompt(':')
})