// @ts-nocheck
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createTheme,
  ThemeProvider,
  Typography
} from "@mui/material";
import * as Colors from "@mui/material/colors";

import * as React from "react";
import { styled, } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";

import { KidsEngine } from "./context/KidsEngine";
import { KidForm } from "./KidForm";
import { KidList } from "./KidList";
import { StatsSettings } from "./StatsSettings";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const theme = createTheme({
  palette: {
    primary: {
      main: Colors.red[900],
      light: Colors.red[300]
    },
    secondary: {
      main: Colors.purple[500],
      light: Colors.purple[200]
    },
    text: {
      primary: "#000",
      secondary: Colors.grey[900]
    },
    background: {
      paper: "#fff",
      primary: Colors.pink[100],
      special: Colors.deepOrange[100],
      secondary: Colors.purple[100]
    }
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(",")
  }
});

const drawerWidth = 800;

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end"
}));

export const App = () => {
  // const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <KidsEngine>
      <ThemeProvider theme={theme}>
        <Box display="flex">
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <SettingsIcon />
              </IconButton>
              <Typography variant="h6">Crusader Kings 3 Kid Picker</Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box"
              }
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader sx={{ bgcolor: "primary.main" }}>
              <Typography variant="h6" color="white">Trait Weighting & Other Settings</Typography>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon color="white" />
                ) : (
                  <ChevronRightIcon color="white" />
                )}
              </IconButton>
            </DrawerHeader>
            <StatsSettings />
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography>Kid List</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <KidList />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel2a-header"
              >
                <Typography>Add Kid Form</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <KidForm />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel3a-header"
              >
                <Typography>Wiki</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <iframe height="960px" width="100%" title="wiki" src="https://ck3.paradoxwikis.com/Traits"></iframe>
              </AccordionDetails>
            </Accordion>
          </Main>
        </Box>
      </ThemeProvider>
    </KidsEngine >
  );
};


export default App;
