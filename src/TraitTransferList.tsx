import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { Avatar, ListItemAvatar } from "@mui/material";
import { useKids } from "./context/KidsEngine";
import _ from "lodash";
import { TraitsRecord } from "./context";

function not(a: any[], b: any[]) {
  return a.filter((value: any) => b.indexOf(value) === -1);
}

function intersection(a: any[], b: any[]) {
  return a.filter((value: any) => b.indexOf(value) !== -1);
}

function union(a: any[], b: any[]) {
  return [...a, ...not(b, a)];
}

export const TraitTransferList = ({ maxChosen = Infinity, type, kidName }: { maxChosen?: number, type: Exclude<keyof TraitsRecord, "education">, kidName?: string | null }) => {
  const [state, update] = useKids();

  const [checked, setChecked] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(Object.keys(state.configuredTraits[type]));

  const leftChecked = intersection(checked, available);
  const rightChecked = intersection(checked, chosen);

  const chosenHash = useMemo(() => chosen.sort().join(''), [chosen])
  const alreadySelectedHash = useMemo(() => Object.keys(state.selectedTraits?.[type] || {}).sort().join(''), [state.selectedTraits, type])

  useEffect(() => {
    if (kidName) {
      const _chosen = (state.kids[kidName]?.traits[type] && Object.keys(state.kids[kidName]?.traits[type] || {})) || []
      const _available = not(Object.keys(state.configuredTraits[type]), _chosen)
      setChosen(_chosen)
      setAvailable(_available)
      setChecked([])
    } else {
      setChecked([])
      setChosen([])
      setAvailable(Object.keys(state.configuredTraits[type] || {}))
    }
  }, [kidName, state.configuredTraits, state.kids, type])

  useEffect(() => {
    if (chosenHash === alreadySelectedHash) return

    const newSelectedTraits = _.cloneDeep(state.selectedTraits)
    newSelectedTraits[type] = {}
    chosen.forEach(traitId => {
      //@ts-ignore
      newSelectedTraits[type][traitId] = state.configuredTraits[type][traitId]
    })
    update("updateSelected", newSelectedTraits);
  }, [alreadySelectedHash, chosen, chosenHash, state.configuredTraits, state.selectedTraits, type, update])

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: string[]) => intersection(checked, items).length;

  const handleToggleAll = (items: string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    const newChosen = chosen.concat(leftChecked);
    setChosen(newChosen);
    setAvailable(not(available, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    const newChosen = not(chosen, rightChecked);
    setAvailable(available.concat(rightChecked));
    setChosen(newChosen);
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: string, items: string[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1, bgcolor: "secondary.light" }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected"
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <List
        sx={{
          height: 400,
          minWidth: 280,
          overflow: "auto"
        }}
        dense
        component="div"
        role="list"
      >
        {items.sort().map((traitId) => {
          const trait = state.configuredTraits[type][traitId]
          return (
            <ListItem key={traitId} button onClick={handleToggle(traitId)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(traitId) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={trait.name} />
              <ListItemAvatar>
                <Avatar
                  src={trait.image}
                  variant="square"
                />
              </ListItemAvatar>
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Card sx={{ borderRadius: 3, bgcolor: "background.secondary" }}>
      <CardHeader
        title={`${_.startCase(type)} Traits`}
        sx={{ px: 2, py: 1, bgcolor: "secondary.light" }}
      />
      <Grid
        container
        p={3}
        spacing={3}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item>{customList("Available", available)}</Grid>
        <Grid item alignSelf="center">
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5, color: "white" }}
              variant="contained"
              size="small"
              onClick={handleCheckedRight}
              disabled={
                leftChecked.length === 0 ||
                leftChecked.length > maxChosen - chosen.length ||
                chosen.length >= maxChosen
              }
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="contained"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          {customList(
            `Chosen${maxChosen === Infinity ? "" : ` (Max ${maxChosen})`}`,
            chosen
          )}
        </Grid>
      </Grid>
    </Card>
  );
};
