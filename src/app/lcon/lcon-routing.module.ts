import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LconComponent } from './lcon.component';
import { AuthGuard } from '../@core/guards/auth.guard';
import { DetailComponent } from './pages/detail/detail.component';
import { LconListComponent } from './pages/lcon-list/lcon-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SummaryComponent } from './summary/summary.component';
import { InboundComponent } from './inbound/inbound.component';
import { OutboundComponent } from './outbound/outbound.component';
import { FalloutComponent } from './fallout/fallout.component';

const routes: Routes = [
  {
    path: '',
    component: LconComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        children: [
          {
            path: 'summary',
            component: SummaryComponent,
          },
          {
            path: 'inbound',
            component: InboundComponent,
          },
          {
            path: 'outbound',
            component: OutboundComponent,
          },
          {
            path: 'fallout',
            component: FalloutComponent,
          },
          {
            path: '',
            redirectTo: '/summary',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'list/:summaryType',
        component: LconListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id',
        component: DetailComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LconRoutingModule {}
