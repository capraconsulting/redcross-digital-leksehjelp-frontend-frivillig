import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      width: '2.8rem',
      height: '2.8rem',
    },
    input: {
      display: 'none',
    },
  }),
);

interface IProps {
  onClick;
  icon;
}

export default function IconButtons(props: IProps) {
  const classes = useStyles();
  const { onClick, icon } = props;

  return (
    <IconButton
      className={classes.button}
      aria-label="Delete"
      onClick={() => onClick()}
      size="small"
    >
      {icon}
    </IconButton>
  );
}
