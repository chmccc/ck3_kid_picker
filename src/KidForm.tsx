import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Button,
  CardHeader,
  Grid,
  TextField,
  Stack,
  RadioGroup,
  Radio,
  FormControlLabel,
  Card,
  Divider,
  Rating,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Collapse,
  Alert,
} from "@mui/material";

import { Kid, SelectedTraits, useKids } from "./context";
import { alphabeticSortByNameProperty, getBaseTrait } from "./helpers";
import { TraitTransferList } from "./TraitTransferList";

const cardStyle = {
  sx: { borderRadius: 3, bgcolor: "background.secondary" }
};

export const KidForm = () => {
  const [state, update] = useKids();

  const [alertMessage, setAlertMessage] = useState("")
  const [age, setAge] = useState(16);
  const [educationFocus, setEducationFocus] = useState<string | null>(null);
  const [educationValue, setEducationValue] = useState<number | null>(null);
  const [gender, setGender] = useState("male");
  const [name, setName] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const editingKid = useMemo(() => Object.values(state.kids).find((kid) => kid?.name && kid.name === selectedName), [selectedName, state.kids])

  const resetSelections = useCallback(() => {
    setAge(16)
    setEducationFocus(null)
    setEducationValue(null)
    setGender("male")
    setName("")
    setAlertMessage("")
  }, [])

  useEffect(() => {
    if (editingKid) {
      const educationFocus = editingKid.traits.education?.id?.split('_')?.[0] ?? null
      const educationValue = parseInt(editingKid.traits.education?.id?.split('_')?.[1] || '0') ?? null

      setAge(editingKid.age)
      setEducationFocus(educationFocus)
      setEducationValue(educationValue)
      setGender(editingKid.gender)
      setAlertMessage(`Editing Kid: ${editingKid.name}`)
    } else resetSelections()
  }, [editingKid, resetSelections])


  const canAddKid = useCallback(() => {
    if (!name && !selectedName) return false
    return true
  }, [name, selectedName])

  useEffect(() => {
    if ((!educationFocus || !educationValue) && state.selectedTraits.education === undefined) return

    let education: SelectedTraits["education"]

    if (educationFocus && educationValue) {
      const newTraitId = educationFocus + '_' + educationValue

      if (newTraitId === state.selectedTraits.education?.id) return

      education = {
        ...getBaseTrait("education", newTraitId),
        id: newTraitId
      }
    }

    const payload: SelectedTraits = {
      ...state.selectedTraits,
      education
    }
    update("updateSelected", payload);
  }, [educationFocus, educationValue, state.selectedTraits, update])

  const addKid = useCallback(() => {
    const nameToUse = selectedName ? selectedName : name || "Error: No name!"
    const newKid: Kid = { name: nameToUse, gender, traits: state.selectedTraits, age };
    update("setKid", newKid);
    resetSelections()
  }, [selectedName, name, gender, state.selectedTraits, age, update, resetSelections]);

  return (
    <Grid
      container
      spacing={3}
      px={3}
      direction="row"
      justifyContent="space-around"
      alignItems="flex-start"
      textAlign="center"
    >
      <Grid xs={5} item>
        <Card id="identification" {...cardStyle}>
          <CardHeader
            title="Identification"
            sx={{ px: 2, py: 1, bgcolor: "secondary.light" }}
          />
          <Grid
            p={2}
            container
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-around"
          >
            <Grid xs={3} item>
              <TextField
                fullWidth
                label="Enter Name"
                variant="standard"
                value={name}
                disabled={!!selectedName}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </Grid>
            <Grid xs={1} item>
              <Divider color="black" variant="middle" orientation="vertical" flexItem>
                OR
              </Divider>
            </Grid>
            <Grid xs={3} item>
              <FormControl fullWidth >
                <InputLabel id="name-select-label">
                  Choose Kid
                </InputLabel>
                <Select
                  disabled={!!name}
                  labelId="name-select-label"
                  id="name-select"
                  value={selectedName ?? "none"}
                  label="Select Name"
                  defaultValue="none"
                  onChange={(event) => {
                    setSelectedName(event.target.value === "none" ? null : event.target.value);
                  }}
                >
                  {[
                    <MenuItem key="none" value="none">None</MenuItem>,
                    ...Object.values(state.kids).sort(alphabeticSortByNameProperty).map(kid => (
                      kid?.name && <MenuItem key={kid.name} value={kid.name}>{kid.name}</MenuItem>
                    ))
                  ]}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={1} item>
              <TextField
                label="Age"
                variant="standard"
                type="number"
                value={age}
                onChange={(event) => {
                  const num = parseInt(event.target.value, 10);
                  setAge(num);
                }}
              />
            </Grid>
            <Grid xs={2} item>
              <RadioGroup
                defaultValue="male"
                value={gender}
                onChange={(event) => {
                  setGender(event.target.value);
                }}
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </Card>
      </Grid >
      <Grid xs={5} item>
        <Card id="education" {...cardStyle}>
          <CardHeader
            title="Education Traits"
            sx={{ px: 2, py: 1, bgcolor: "secondary.light" }}
          />
          <Grid
            direction="row"
            alignItems="center"
            justifyContent="center"
            container
            spacing={2}
            p={2}
          >
            <Grid xs={6} item>
              <FormControl fullWidth>
                <InputLabel id="education-focus-select-label">
                  Education Focus
                </InputLabel>
                <Select
                  labelId="education-focus-select-label"
                  id="education-focus-select"
                  value={educationFocus || "none"}
                  defaultValue="none"
                  label="Education Focus"
                  onChange={(event) => {
                    setEducationFocus(event.target.value === "none" ? null : event.target.value);
                  }}
                >
                  <MenuItem value={"none"}>None</MenuItem>
                  <MenuItem value={"diplomacy"}>Diplomacy</MenuItem>
                  <MenuItem value={"martial"}>Martial</MenuItem>
                  <MenuItem value={"stewardship"}>Stewardship</MenuItem>
                  <MenuItem value={"intrigue"}>Intrigue</MenuItem>
                  <MenuItem value={"learning"}>Learning</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Rating
                disabled={!educationFocus}
                sx={{ padding: 1, bgcolor: "white", borderRadius: 3 }}
                color="primary"
                name="education-rating"
                value={educationValue ?? 0}
                defaultValue={2}
                max={4}
                onChange={(event, value) => {
                  setEducationValue(value);
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid xs={1.5} alignSelf="flex-start" item>
        <Stack spacing={2}>
          <Button
            size="large"
            variant="contained"
            onClick={addKid}
            disabled={!canAddKid()}
          >
            {`${selectedName ? 'Edit' : 'Add'} This Kid`}
          </Button>
          <Collapse in={!!alertMessage}>
            <Alert severity="info">
              {alertMessage}
            </Alert>
          </Collapse>
        </Stack>
      </Grid>
      <Grid xs={6} item>
        <TraitTransferList kidName={selectedName} type="personality" maxChosen={3} />
      </Grid>
      <Grid xs={6} item>
        <TraitTransferList kidName={selectedName} type="genetic" />
      </Grid>
    </Grid >
  );
};
