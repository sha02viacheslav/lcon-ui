import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SsoAuthComponent } from './ssoAuth.component';

const routes: Routes = [
    {
        path: '',
        component: SsoAuthComponent,
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

export class SsoAuthRoutingModule {}
