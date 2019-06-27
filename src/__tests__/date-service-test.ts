import { dateStringFormat } from '../services/date-service';

describe('date-service', () => {
  it('TEST: dateStringFormat \n Should return string on the form DD.MM.YYYY kl. HH.MM', async () => {
    const dateString = await dateStringFormat('2019-06-24 09:38:29.053');
    expect(dateString).toEqual('24.06.2019 kl.09.38');
  });
  it('TEST: dateStringFormat \n Should fail and return inputvalue', async () => {
    const inputvalue = '2019.06.24 kl 09:38:29.053';
    const dateString = await dateStringFormat(inputvalue);
    expect(dateString).toEqual(inputvalue);
  });
});
