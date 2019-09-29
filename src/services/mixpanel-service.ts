import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.MIXPANEL_TOKEN);

export class MixpanelService {
  public static track(name, props) {
    //if (process.env.NODE_ENV === 'production') {
    mixpanel.track(name, props);
    //}
  }
}
