"use client";
import { useEffect, useRef } from 'react';
import { Box } from "@mui/material";
import { BotBubble, HumanBubble } from "./Bubbles";

export enum Role {
    BOT,
    USER
}

export interface ChatChainElement {
    role: Role,
    text: string | null
}

export type ChatChain = ChatChainElement[];

interface ChatThreadProps {
    chatChain: ChatChain;
    scrollBoxRef: React.RefObject<HTMLDivElement>;
    autoScroll: boolean;
    setAutoScroll: (value: boolean)=>void;
}

export default function ChatThread({ chatChain, autoScroll, setAutoScroll }: ChatThreadProps) {
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(() => {
        const isLastChatChainUser = chatChain.length > 0 && chatChain[chatChain.length - 1].role === Role.USER
        if (isLastChatChainUser) {
            setAutoScroll(true);
            scrollToBottom();
        }
        else if (autoScroll) {
            scrollToBottom();
        }
    }, [chatChain, autoScroll, setAutoScroll]);

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            py={2}
            px={1}
        >
            {chatChain.map((chatChainElement, index) => {
                const isBot = chatChainElement.role === Role.BOT;
                const lastElementIsBot = (index > 0 && chatChain[index - 1].role === Role.BOT);
                const isLastElement = index === chatChain.length - 1;

                return (
                    <Box key={index} pb={isLastElement ? 0 : 1}>
                        {isBot
                            ? <BotBubble text={chatChainElement.text} showProfilePic={!lastElementIsBot} />
                            : <HumanBubble text={chatChainElement.text} />}
                    </Box>
                );
            })}
            {/* Invisible div to scroll into view for auto-scroll */}
            <div ref={chatEndRef} />
        </Box>
    );
}