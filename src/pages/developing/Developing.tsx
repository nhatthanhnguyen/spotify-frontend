import { Grid, Box, Stack, Typography } from "@mui/material";
import Nav from "../../components/Nav";
import TopBar from "../../components/TopBar";

const Developing = () => {
  const renderedMessage = (
    <Stack
      height="calc(100vh - 90px - 64px)"
      alignItems="center"
      justifyContent="center"
    >
      <Typography fontSize="1.5rem" fontWeight="bold">
        This page is currently under development
      </Typography>
    </Stack>
  );
  return (
    <Grid direction="row" container height="100%">
      <Grid position="fixed" width="203px" height="100%">
        <Nav currentPage="" />
      </Grid>
      <Grid marginLeft="203px" height="100%" width="100%">
        <TopBar />
        <Box sx={{ px: 4, pt: 3 }}>{renderedMessage}</Box>
        <Box height="120px" width="100%" />
      </Grid>
    </Grid>
  );
};

export default Developing;
