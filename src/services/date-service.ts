export const timeStringFromDate = (dateString: string): string => {
  return dateString.split(' ')[0];
};

const formatAsDate = (value: string): string => {
  return value
    .split('-')
    .reverse()
    .join('.');
};

const formatAsTime = (value: string): string => {
  const [HH, MM] = value.split(':');
  return `${HH}.${MM}`;
};

export const dateStringFormat = (value: string): string => {
  if (/^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}/.test(value)) {
    const [date, time] = value.split(' ');

    const dateString = formatAsDate(date);
    const timeString = formatAsTime(time);

    return `${dateString} kl.${timeString}`;
  }
  return value;
};
