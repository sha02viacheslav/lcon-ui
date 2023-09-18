import { ModuleWithProviders, NgModule, Optional, SkipSelf, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf, Observable } from 'rxjs';
import { ServerDetails } from '../@core/config.core';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { AnalyticsService } from './utils';
import { UserData } from './data/abstracts/user-data.abstract';
import { UserService } from './services/user.service';
import { HttpClient } from '@angular/common/http';

const DATA_SERVICES = [
  { provide: UserData, useClass: UserService },
];
@Injectable({ providedIn: 'root' })
export class NbSimpleRoleProvider extends NbRoleProvider {
  constructor(private http: HttpClient) {
    super();
  }

  getRole() {
    return new Observable<string>(obs => {
      this.http.get(`${ServerDetails.baseUrl}/auth/session`, { withCredentials: true }).subscribe((resp: any) => {
        obs.next(resp.data.role);
      }, (error: any) => {
        obs.next('admin');
      });
    });
  }
}

export const NB_CORE_PROVIDERS = [
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({

    strategies: [
      NbDummyAuthStrategy.setup({
        name: 'email',
      }),
    ],
    forms: {},
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      user: {
        view: 'user',
      },
      moderator: {
        parent: 'user',
        view: 'moderator',
      },
      admin: {
        parent: 'moderator',
        view: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
