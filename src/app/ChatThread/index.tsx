"use client";
import { useEffect, useRef, useState } from 'react';
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
}

export default function ChatThread({ chatChain }: ChatThreadProps) {
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollHeight, scrollTop, clientHeight } = chatContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 25;
        setAutoScroll(isNearBottom);
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
    }, [chatChain, autoScroll]);

    return (
        <Box
            ref={chatContainerRef}
            display={'flex'}
            flexDirection={'column'}
            py={2}
            px={1}
            overflow={'auto'}
            onScroll={handleScroll}
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