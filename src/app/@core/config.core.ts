import { environment } from '../../environments/environment';

const baseUrl = 'https://lcon-dashboard-api.ho-g2.cf.comcast.net';
export const ServerDetails = {
  baseUrl: environment.production ? baseUrl : 'http://localhost:3000',
  analytics: false,
  routerConfig: {
    withCredentials: true,
  },
};

export const SsoConfig = {
  clientId: '67a4e126-22ba-406a-b987-61a2508bc259',
  responseType: 'code',
  redirectUri: environment.production
    ? 'https://lcon-dashboard-ui.ho-g2.cf.comcast.net/auth'
    : 'http://localhost:4200/auth',
  scope: 'openid%20profile%20email%20User.Read',
  domainHint: 'comcast.com',
};
