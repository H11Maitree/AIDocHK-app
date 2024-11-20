import { alpha, Box } from "@mui/material";
import Image from "next/image";

interface BubbleProps {
    text: string | null;
    color: string;
}

function Bubble({ text, color }: BubbleProps) {
    return (
        <Box borderRadius={5}
            padding={1.5}
            sx={{ backgroundColor: alpha(color, 0.5) }}>
            {text}
        </Box>
    );
}

function BotBubble({ text, showProfilePic = true }: { text: string | null, showProfilePic?: boolean }) {
    return (
        <Box display={'flex'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            flexDirection={'row'}
            paddingRight={4}
            gap={1}>
            <Image
                src="/spencer-ai-pic.jpeg"
                width={50}
                height={50}
                alt="Spensor AI"
                style={{
                    borderRadius: '50%',
                    visibility: showProfilePic ? 'visible' : 'hidden'
                }}
            />
            <Bubble text={text} color="#009CDF" />
        </Box>
    );
}

function HumanBubble({ text }: { text: string | null }) {
    return (
        <Box display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'flex-start'}
            flexDirection={'row'}
            paddingLeft={4}>
            <Bubble text={text} color="#973999" />
        </Box>
    );
}

export { BotBubble, HumanBubble }