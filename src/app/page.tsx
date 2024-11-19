import { SendAltFilled } from "@carbon/icons-react";
import { Box, Container, IconButton, InputBase, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        // border: '1px solid #ddd',
        padding: 0,
      }}
    >
      <Box
        sx={{
          padding: 2,
          borderBottom: '1px solid #ddd',
        }}
      >
        <Typography variant="h6"><strong>AIDoc</strong>HK</Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: 2,
        }}
      >
        {/* chat thread*/}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 1,
          borderTop: '1px solid #ddd',
          position: 'sticky',
          bottom: 0,
          background: 'white',
        }}
      >
        <InputBase
          sx={{ flexGrow: 1, ml: 1 }}
          placeholder="I have a back pain!"
        />
        <IconButton>
          <SendAltFilled />
        </IconButton>
      </Box>
    </Container>
  );
}