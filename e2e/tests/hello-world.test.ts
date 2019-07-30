import { Selector } from 'testcafe';

fixture`Frivillig`.page('http://localhost:3001');

class LandingPage {
  public headline: Selector;

  public constructor() {
    this.headline = Selector('title');
  }

  public getHeadlineText = () => this.headline.textContent;
}

const landingPage = new LandingPage();

test('Check welcome message', async t => {
  await t
    .expect(landingPage.getHeadlineText())
    .eql('Frivillig|Digital Leksehjelp');
});
