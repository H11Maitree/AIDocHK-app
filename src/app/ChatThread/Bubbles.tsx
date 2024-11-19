import { alpha, Box } from "@mui/material";

interface BubbleProps {
    text: string|null;
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

function BotBubble({ text }: { text: string|null }) {
    return (
        <Box display={'flex'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            flexDirection={'row'}
            paddingRight={8}>
            <Bubble text={text} color="#009CDF" />
        </Box>
    );
}

function HumanBubble({ text }: { text: string|null }) {
    return (
        <Box display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'flex-start'}
            flexDirection={'row'}
            paddingLeft={8}>
            <Bubble text={text} color="#973999" />
        </Box>
    );
}

export { BotBubble, HumanBubble }