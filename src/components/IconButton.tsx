import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
  }),
);

interface IProps {
  onClick;
}

export default function IconButtons(props: IProps) {
  const classes = useStyles();
  const { onClick } = props;

  return (
    <IconButton
      className={classes.button}
      aria-label="Delete"
      onClick={() => onClick()}
    >
      <DeleteIcon />
    </IconButton>
  );
}
