// @ts-nocheck
import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createTheme,
  Grid,
  Tab,
  Tabs,
  ThemeProvider,
  Typography
} from "@mui/material";
import * as Colors from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { KidsEngine } from "./context";
import { StatsSettings } from "./StatsSettings";
import { KidsPanel } from "./KidsPanel";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

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
  const [open, setOpen] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

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
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <Grid container width="100%" direction="row" alignItems="center">
                <Grid xs={3} item>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: "none" }) }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Grid>
                <Grid container xs={6} justifyContent="center" item>
                  <Typography variant="h6">Crusader Kings 3 Kid Picker</Typography>
                </Grid>
                <Grid xs={3} item>
                  <Tabs
                    value={tabIndex}
                    onChange={handleChangeTab}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab id="kids-mgr" label="Kids Management" />
                    <Tab id="tab-2" label="Traits Wiki" />
                    <Tab id="tab-3" label="Special Buildings" />
                  </Tabs>
                </Grid>
              </Grid>
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
            <Box mt={4} p={0}>
              <TabPanel value={tabIndex} index={0} dir={theme.direction}>
                <KidsPanel />
              </TabPanel>
              <TabPanel value={tabIndex} index={1} dir={theme.direction}>
                <iframe id="traits-iframe" height="1180px" width="100%" title="Traits wiki" src="https://ck3.paradoxwikis.com/Traits"></iframe>
              </TabPanel>
              <TabPanel value={tabIndex} index={2} dir={theme.direction}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel2a-header"
                  >
                    <Typography>Map</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box width="100%" display="flex" justifyContent="center" mt={3}>
                      <img alt="Special Buildings Map" height="1100px" src={require('./images/special_buildings.png')} />
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel2b-header"
                  >
                    <Typography>Wiki</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <iframe id="buildings-iframe" height="1050px" width="100%" title="Buildings wiki" src="https://ck3.paradoxwikis.com/Special_buildings"></iframe>
                  </AccordionDetails>
                </Accordion>
              </TabPanel>
              <DrawerHeader />
            </Box>
          </Main>
        </Box>
      </ThemeProvider>
    </KidsEngine >
  );
};


export default App;
