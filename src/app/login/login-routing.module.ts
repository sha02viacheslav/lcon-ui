import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        children: [
            {
                path: 'ssoAuth',
                loadChildren: () => import('./ssoAuth/ssoAuth.module').then(m => m.SsoAuthModule),
            }
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ],
})

export class LoginRoutingModule {}
