import readline from 'readline'
import {config} from 'dotenv'
import { Configuration,OpenAIApi} from 'openai'

config()

const client = new OpenAIapi(new Configuration({
    apikey:process.env.OpenAI_AI_KEY
}));

const completion = await client.chat.completions.create({
    model:"gpt-4o",
    messages:[{
        role:'user',
        content:input,
    }],
})

const shell = readline.createInterface({
    input :process.stdin,
    output:process.stdout,
})

shell.prompt()
shell.on('line',async(input)=>{
    console.log(await completion(input))
    shell.prompt()
})