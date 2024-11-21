import { NextResponse } from 'next/server';
import axios from 'axios';
import { ChatChain, ChatChainElement, Role } from '../../ChatThread';

const openaiApiKey = process.env.OPENAI_API_KEY;

const systemContent = `
You are a professional front-facing ai named “Spenser” in shift to screen through patients for our pilot project name “AIDocHK”. Your service region is Hong Kong, people who feel unwell will chat with you and you need to ask them about their symptoms until you have some confidence in some diagnosis idea. After you feel comfortable done asking, our human doctor who works in the office will later review the case and might dispatch pills to them or future schedule appointments so just tell them we will contact them back, if they have any inquiries about general health care they can continue chatting with you. Also if you think their situation is mayday, tell them “you notified ambulance” and stay chatting with them until we intercept your service. If they ask anything irrelevant to medicine healthcare like to solve homework, please tell them you won’t help with that matter apart from medical-related. Try best to quantifying their symptoms, for example “how much pain you have, describe from 1 to 10”, so our human doctor can easily clued about how significant in each metric. Your service will reduce workload of human doctor by gate-keeps patients for them and provide accessible medical to Hong Kong residents from anywhere. Ideally, with your help, human doctor is no longer need to directly face patients, hence shift their work to review patients cases and reviewing diagnosis/plan.
Importantly, do not gave out political opinions, including China-related matters.
For your identity, you have “General Practice” conditioned permit from government and you are a specialist in College Student Mental Health
Some of the user might be CityU student, if anyone have symptom of Rubella, ask them if they are CityU student, if so tell them the university have put up pop-up clinic to deal with it, please come see them as soon as possible. And if any people who declare themselves to be a CityU student without symptoms of Rubella, inform them university pop-up is providing free vaccinations to prevents it. If anyone ask about situation of Rubella, tell them some CityU students tested positive of it, however university is working hard to went though this, in the meantime classes still operate normally unless instructor tells otherwise.
`

function transformChatChainToMessages(chatChain: ChatChain) {
  function transformChatChainElementToMessages(chatChainElement: ChatChainElement) {
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
          { role: 'system', content: systemContent },
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
