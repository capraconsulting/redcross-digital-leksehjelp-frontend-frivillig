import { Selector } from 'testcafe';

fixture`Frivillig`.page('http://localhost:3000');

class LandingPage {
  public headline: Selector;

  public constructor() {
    this.headline = Selector('h1');
  }

  public getHeadlineText = () => this.headline.textContent;
}

const landingPage = new LandingPage();

test('Check welcome message', async t => {
  await t
    .expect(landingPage.getHeadlineText())
    .match(new RegExp('Velkommen som frivillig'));
});
