import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { KidList } from "./KidList";
import { KidForm } from "./KidForm";
import { SelectedKidChanger } from "./types";

export const KidsPanel = () => {
    const [selectedName, setSelectedName] = useState<string | null>(null);

    const handleChangeKid: SelectedKidChanger = (kidName) => {
        setSelectedName(kidName);
    };

    return (
        <>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1a-header">
                    <Typography>Kid List</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <KidList onSelectKid={handleChangeKid} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1b-header">
                    <Typography>Kid Form</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <KidForm onSelectKid={handleChangeKid} selectedName={selectedName} />
                </AccordionDetails>
            </Accordion>
        </>
    );
};
