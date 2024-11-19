import { NextResponse } from 'next/server';
import axios from 'axios';
import { ChatChain, ChatChainElement, Role } from '../../ChatThread';

const openaiApiKey = process.env.OPENAI_API_KEY;

function transformChatChainToMessages(chatChain:ChatChain){
    function transformChatChainElementToMessages(chatChainElement: ChatChainElement){
        return {
            role: chatChainElement.role == Role.BOT ? "assistant" : "user",
            content: chatChainElement.text
        };
    }
    return chatChain.map(transformChatChainElementToMessages);
}

export async function POST(req: Request) {
  try {
    const chatChain = await req.json() as ChatChain; 

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini', 
        messages: [
          { role: 'system', content: 'You are a virtual health assistant name Dr. Spencer providing support for general medical inquiries. Your role is to assist users with health-related questions and concerns, offering information on symptoms, conditions, treatments, and wellness advice based on widely accepted medical knowledge.' },
          ...transformChatChainToMessages(chatChain)
        ],
        stream: true,
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
      }
    );

    const stream = response.data;

    return new NextResponse(
      stream, 
      {
        headers: {
          'Content-Type': 'application/json', 
        },
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new NextResponse('Failed to process the request', { status: 500 });
  }
}
