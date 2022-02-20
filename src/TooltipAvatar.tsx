import * as React from 'react';
import { Popover, Typography, Button, Avatar, Box, styled, Tooltip, tooltipClasses } from '@mui/material';
import { Trait, TraitsRecord, useKids } from './context';

//@ts-ignore
const LightTooltip = styled(({ className, ...props }) => (
  //@ts-ignore
  <Tooltip {...props} classes={{ popper: className }} />
  //@ts-ignore
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));
//@ts-ena

export const TooltipAvatar = ({ type, trait }: { trait?: Trait, type?: keyof TraitsRecord }) => {
  const [state] = useKids()

  if (!type || !trait) return (
    //@ts-ignore
    < LightTooltip title={"unknown"} >
      <Avatar variant="square">?</Avatar>
    </LightTooltip >
  )

  const dbTrait = state.configuredTraits[type]?.[trait.id]

  let score: string | number = dbTrait?.score
  if (dbTrait.isVirtue) score += state.config.virtueModifier || 0
  if (dbTrait.isSin) score += state.config.sinModifier || 0

  if (score > 0) score = "+" + score

  return (
    <div>
      {/* @ts-ignore */}
      <LightTooltip title={`${trait.name} (${score})`}>
        <Avatar
          src={trait.image}
          variant="square"
        />
      </LightTooltip>
    </div >
  );
}