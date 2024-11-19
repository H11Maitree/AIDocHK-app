"use client";
import { SendAltFilled } from "@carbon/icons-react";
import { Box, Container, IconButton, InputBase, Typography } from "@mui/material";
import ChatThread, { ChatChain, Role } from "./ChatThread";
import { useState } from "react";

// const exampleChatChain: ChatChain = [
//   {
//     role: Role.BOT,
//     text: "Hi, How can I help you today?"
//   },
//   {
//     role: Role.USER,
//     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//   },
//   {
//     role: Role.BOT,
//     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//   },
// ]

export default function Home() {
  const [chatChain, setChatChain] = useState<ChatChain>([{role: Role.BOT, text: "Hello, Im Doctor Spencer!"}, {role: Role.BOT, text: "What's kind of sick are you today?"}]); // Current chat history
  const [input, setInput] = useState<string>(''); // User input field

  // Send a message to the API and stream the response
  const sendMessage = async (message: string) => {
    setInput("");
    // Add the user message to the chat history
    const newChatChain = [...chatChain, { role: Role.USER, text: message }];
    setChatChain(newChatChain); // Update the chat thread UI

    try {
      // Call the API route and send the current chat history
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

      const newerChatChain = [...newChatChain, { role: Role.BOT, text: null}]
      setChatChain(newerChatChain);

      // Continuously read from the stream until done
      while (!done) {
        const { value, done: doneReading } = await reader?.read() || {};
        done = doneReading === undefined ? false : doneReading;

        const payload = decoder.decode(value, { stream: true });
        if (payload) {
          const cleanPayload = payload.replaceAll("data: ", '');
          const chunks = cleanPayload.split("\n").filter((chunk)=> !( !chunk || chunk.trim()=="[DONE]"))
          for (const chunk of chunks) {
            try {
              const parsedData = JSON.parse(chunk);
              if (parsedData?.choices?.[0]?.delta?.content) {
                text += parsedData.choices[0].delta.content; 
                setChatChain([...newChatChain, { role: Role.BOT, text: text}]);
              }
            }
            catch (error) {
              console.error('Error parsing chunk:', chunk, error);
            }
          }
          
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: 0,
      }}
    >
      <Box
        position={'sticky'}
        top={0}
        padding={2}
        sx={{
          zIndex: 1000,       // Ensure it stays above other content
          // backgroundColor: 'white', // Add background to avoid content bleeding when scrolled
          borderBottom: '1px solid #ddd',
        }}
      >
        <Typography variant="h6"><strong>AIDoc</strong>HK</Typography>
        <Typography variant="body2">This is <strong>a demo</strong> for GE2134 class <strong>please do not rely on responed information!</strong></Typography>
      </Box>
      <Box
        flexGrow={1}
        overflow={'auto'}
        padding={'2'}
      >
        <ChatThread chatChain={chatChain} />
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
          onChange={(e) => setInput(e.target.value)} // Update input state
        />
        <IconButton onClick={() => sendMessage(input)}>
          <SendAltFilled />
        </IconButton>
      </Box>
    </Container>
  );
}