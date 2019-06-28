import { dateStringFormat, timeStringFromDate } from '../services/date-service';

describe('date-service', () => {
  it('TEST: dateStringFormat \n Should return string on the form DD.MM.YYYY kl. HH.MM', async () => {
    const dateString = await dateStringFormat('2019-06-24 09:38:29.053');
    expect(dateString).toEqual('24.06.2019 kl.09.38');
  });
  it('TEST: dateStringFormat \n Should fail and return inputvalue', async () => {
    const inputValue = '2019.06.24 kl 09:38:29.053';
    const dateString = await dateStringFormat(inputValue);
    expect(dateString).toEqual(inputValue);
  });
  it('TEST: timeStringFromDate \n Should return time on the form HH:MM', async () => {
    const inputDate = new Date('Fri Jun 28 2019 10:06:58');
    const receivedValue = await timeStringFromDate(inputDate);
    const expectedValue = '10:06';
    expect(receivedValue).toEqual(expectedValue);
  });
});
