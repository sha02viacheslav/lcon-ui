import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'login',
        pathMatch: 'full',
        loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'auth',
        pathMatch: 'full',
        loadChildren: () => import('./login/ssoAuth/ssoAuth.module').then((m) => m.SsoAuthModule),
      },
      {
        path: '',
        loadChildren: () => import('./lcon/lcon.module').then((m) => m.LconModule),
      },
    ],
  },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
