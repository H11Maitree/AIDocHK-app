"use client";
import { SendAltFilled } from "@carbon/icons-react";
import { Box, Container, InputBase, Typography } from "@mui/material";
import ChatThread, { ChatChain, Role } from "./ChatThread";
import { useRef, useState } from "react";
import Image from "next/image";
import { LoadingButton } from "@mui/lab";

export default function Home() {
  const [chatChain, setChatChain] = useState<ChatChain>([{ role: Role.BOT, text: "Hello, Im Doctor Spencer!" }, { role: Role.BOT, text: "What's kind of sick are you today?" }]); // Current chat history
  const [input, setInput] = useState<string>('');
  const [isBotReplying, setIsBotReplying] = useState<boolean>(false);

  const scrollBoxRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  let lastScrollTop = 0;
  const handleScroll = () => {
    if (!scrollBoxRef.current) return;
    const { scrollTop } = scrollBoxRef.current;
    if (scrollTop < lastScrollTop) {
      // Scrolling up
      setAutoScroll(false);
    }
    lastScrollTop = scrollTop;
  };

  const sendMessage = async (message: string) => {
    setIsBotReplying(true);
    setInput("");
    const newChatChain = [...chatChain, { role: Role.USER, text: message }];
    setChatChain(newChatChain); // Update the chat thread UI

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChatChain),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from OpenAI');
      }

      // Handle the streamed response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = '';

      const newerChatChain = [...newChatChain, { role: Role.BOT, text: null }]
      setChatChain(newerChatChain);

      let previouChunk: string | null = null;
      while (!done) {
        const { value, done: doneReading } = await reader?.read() || {};
        done = doneReading === undefined ? false : doneReading;

        const payload = decoder.decode(value, { stream: true });
        if (payload) {
          const dataChunks = payload.split('data:');
          const chunks = dataChunks
            .map((chunk) => chunk.replace(/\s*/, '').replace(/\s*$/, ''))
            .filter((chunk) => !(!chunk || chunk.trim() == "[DONE]"))
          for (const chunk of chunks) {
            const currrentChunk: string = previouChunk ? previouChunk + chunk : chunk
            try {
              const parsedData = JSON.parse(currrentChunk);
              if (parsedData?.choices?.[0]?.delta?.content) {
                text += parsedData.choices[0].delta.content;
                setChatChain([...newChatChain, { role: Role.BOT, text: text }]);
              }
              previouChunk = null;
            }
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            catch (error) {
              previouChunk = currrentChunk;
              // console.error('Error parsing chunk:', currrentChunk, error);
            }
          }

        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsBotReplying(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '' && !isBotReplying) {
      sendMessage(input);
      e.preventDefault();
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '-webkit-fill-available',
        padding: 0,
      }}
    >
      <Box
        position={'sticky'}
        top={0}
        padding={2}
        sx={{
          zIndex: 1000,
          borderBottom: '1px solid #ddd',
          backgroundColor: 'var(--background)',
        }}
      >
        <Typography variant="h6"><strong>AIDoc</strong>HK</Typography>
        <Typography variant="body2">This is <strong>a demo</strong> for GE2134 class <strong>please do not rely on responed information!</strong></Typography>
      </Box>
      <Box
        flexGrow={1}
        overflow={'auto'}
        padding={'2'}
        ref={scrollBoxRef}
        onScroll={handleScroll}
      >
        {!chatChain.some((element) => element.role === Role.USER) &&
          <Box
            display={'flex'}
            justifyContent={'space-around'}
            py={2}
          >
            <Box
              display={'flex'}
              maxWidth={300}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Typography variant="subtitle2">
                Today&apos;s AI doctor on duty
              </Typography>
              <Image
                src="/spencer-ai-pic.jpeg"
                width={150}
                height={150}
                alt="Spensor AI"
                style={{
                  borderRadius: '50%',
                  paddingTop: 8
                }}
              />
              <Typography paddingY={1}>
                Doctor <strong>Spenser</strong>
              </Typography>
              <Typography variant="body2">
                <strong>General Practice</strong>, specialist in College Student Mental Health
              </Typography>
            </Box>
          </Box>
        }
        <ChatThread chatChain={chatChain} scrollBoxRef={scrollBoxRef} autoScroll={autoScroll} setAutoScroll={setAutoScroll} />
      </Box>
      <Box
        display={'flex'}
        alignItems={'center'}
        padding={1}
        position={'sticky'}
        bottom={0}
        sx={{
          borderTop: '1px solid #ddd',
          background: 'white',
        }}
      >
        <InputBase
          sx={{ flexGrow: 1, ml: 1 }}
          placeholder="I have a back pain!"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <LoadingButton loading={isBotReplying} onClick={() => sendMessage(input)} disabled={input.trim() === ''}>
          <SendAltFilled />
        </LoadingButton>
      </Box>
    </Container>
  );
}