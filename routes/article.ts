import axios from 'axios';
import { parseStringPromise } from 'xml2js';


async function fetchRssFeed(url:string): Promise<string> {
    try{
        const res = await axios.get(url,{responseType:'text'});
        return res.data;
    }catch(error){
        console.error('error fetching Rssfeed: ',error);
        throw new Error('fail to fetch RSS feed')
    }
}

//test
const test= 'https://feeds.bbci.co.uk/news/rss.xml'
//const xmldata=await fetchRssFeed(test); 

interface feedItem{
    title:string;
    link:string;
    pubDate:string;
    description?:string;

};

async function parseRssFeed(xml:string):Promise<any> {
    try{
        const result =await parseStringPromise(xml);
        console.log(result);
        return result;
    }catch(error){
        console.log('error parsing the RSS feed:',error);
        throw new Error('fail to parse RSS feed');
    }
};


async function extractFeedItems(parsedata:any):Promise<feedItem[]>{
    const items = parsedata.rss.channel[0].item.map((item:any)=>({
        title:item.title[0],
        link:item.link[0],
        pubDate:item.pubDate[0],
        description:item.description[0]
    }));
    return items;
};

//parseRssFeed(xmldata);

async function articleRSSDate(url:string):Promise<void>{
    try{
        const xmldata = await fetchRssFeed(url);
        const parsedata = await parseRssFeed(xmldata);
        const feedItems =await extractFeedItems(parsedata);

        console.log('RSS Feed Items:');
        feedItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`Link: ${item.link}`);
        console.log(`Published: ${item.pubDate}`);
        console.log(`Description: ${item.description || 'No description available'}`);
    }); 
    }catch (error) {
    console.error('Error during RSS feed processing:', error);
  }
}

//test
articleRSSDate(test);