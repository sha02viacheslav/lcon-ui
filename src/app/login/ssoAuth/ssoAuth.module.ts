import { NgModule } from '@angular/core';
import { SsoAuthRoutingModule } from './ssoAuth-routing.module';
import { SsoAuthComponent } from './ssoAuth.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [
        SsoAuthComponent,
    ],
    imports: [
        SsoAuthRoutingModule,
        MatCardModule,
    ],
})

export class SsoAuthModule {}
