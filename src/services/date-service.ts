import Moment from 'moment';

export function dateFormat(date: string) {
  const dateString = Moment(date).format('DD.MM.YY');
  const timeString = Moment(date).format('HH.SS');
  return `${dateString} kl.${timeString}`;
}
