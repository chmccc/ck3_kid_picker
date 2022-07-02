import _ from "lodash";
import {
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  CardHeader,
  CardActionArea,
  IconButton,
} from "@mui/material";
import { useKids, Kid } from "./context";
import { TooltipAvatar } from "./TooltipAvatar";
import DeleteIcon from '@mui/icons-material/Delete';
import { useScoreColorizer } from "./helpers";

export const KidCard = ({ kid, onEditClick }: { kid: Kid, onEditClick: () => void }) => {
  const [, update] = useKids();
  const scoreColor = useScoreColorizer(kid.name)
  console.log(kid.name, scoreColor)
  const { traits } = kid

  const personalityTraits = Object.values(traits.personality || {})
  const personalityAvatars = personalityTraits.map((trait) => (
    <TooltipAvatar type="personality" key={trait.name} trait={trait} />
  )).concat(Array(3 - personalityTraits.length).fill(<TooltipAvatar />))

  return (
    <Card
      key={kid.name}
      sx={{ textAlign: "center", backgroundColor: "background.primary" }}
      style={{ boxShadow: `0 0 8px 2px ${scoreColor}` }}
    >
      <CardActionArea
        onClick={onEditClick}
      >
        <CardHeader
          title={kid.name}
          subheader={(
            <Stack direction="row" justifyContent="space-between">
              <Typography>{`${_.startCase(kid.gender)}`}</Typography>
              <Typography>{` Age ${kid.age}`}</Typography>
            </Stack>
          )}
          sx={{ px: 3, py: 1, bgcolor: "primary.light" }}
        />
        <CardContent>
          <Stack alignItems="center" spacing={2}>
            <Typography fontWeight={700} variant="h6">
              {`Score: ${kid.score}`}
            </Typography>
            {<TooltipAvatar type="education" trait={traits.education} />}
            <Stack direction="row" justifyContent="space-around" spacing={1}>
              {personalityAvatars}
            </Stack>
            <Stack direction="row" justifyContent="space-around" spacing={1}>
              {traits.genetic ? Object.values(traits.genetic).map((trait) => (
                <TooltipAvatar type="genetic" key={trait.name} trait={trait} />
              )) : null}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton size="small" onClick={() => update("deleteKid", kid.name)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card >
  );
};
