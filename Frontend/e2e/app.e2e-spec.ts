import { RtxuiPage } from './app.po';

describe('rtxui App', () => {
  let page: RtxuiPage;

  beforeEach(() => {
    page = new RtxuiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
