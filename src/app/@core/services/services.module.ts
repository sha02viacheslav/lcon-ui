import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './user.service';

const SERVICES = [
    UserService,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        ...SERVICES,
    ],
})
export class ServicesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ServicesModule,
            providers: [
                ...SERVICES,
            ],
        } as ModuleWithProviders;
    }
}
