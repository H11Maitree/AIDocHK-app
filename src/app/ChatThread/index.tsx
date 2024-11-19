import { Box } from "@mui/material";

import {BotBubble, HumanBubble} from "./Bubbles"

export enum Role {
    BOT,
    USER
}

export interface ChatChainElement {
    role: Role,
    text: string|null
}

export type ChatChain = ChatChainElement[];

interface ChatThreadProps {
    chatChain: ChatChain;
}

export default function ChatThread({ chatChain }: ChatThreadProps) {
    return (
        <Box display={'flex'} flexDirection={'column'} gap={1} py={2} px={1}>
            {chatChain.map((chatChainElement, index) => (
                chatChainElement.role === Role.BOT 
                ? <BotBubble key={index} text={chatChainElement.text} />
                : <HumanBubble key={index} text={chatChainElement.text} />
            ))}
        </Box>
    );
}