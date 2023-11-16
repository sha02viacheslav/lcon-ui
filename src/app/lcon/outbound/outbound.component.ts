import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { SummaryType } from '@enums';
import { BlockUIService } from 'ng-block-ui';

@Component({
  selector: 'app-outbound',
  templateUrl: './outbound.component.html',
  styleUrls: ['./outbound.component.scss'],
})
export class OutboundComponent implements OnInit {
  readonly SummaryType = SummaryType;
  dateFilter: { start: string; end: string };

  keys = new Map<number, string>()
    .set(0, 'firstOutbound')
    .set(1, 'secondOutbound')
    //.set(2,"primaryLcon")
    //.set(3,"secondaryLcon")
    .set(2, 'totalOutbound');

  params = new Map<string, string>()
    .set(this.keys.get(0), 'firstnotificationdate IS NOT NULL AND secondnotificationdate IS NULL') // set table to "(select distinct serviceorderid from public.lconsummaryreport) as ordercount"
    .set(this.keys.get(1), 'secondnotificationdate IS NOT NULL');
  //.set(this.keys.get(2),"")
  //.set(this.keys.get(3),"")

  queries = new Map<string, number>();

  constructor(private api: ApiService, private blockUIService: BlockUIService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData() {
    this.blockUIService.start('APP', `Loading...`);
    const promises = [];
    for (let i = 0; i < this.params.size; i++) {
      promises.push(
        new Promise((resolve) => {
          this.api.getCount({ rawWhere: this.params.get(this.keys.get(i)), ...this.dateFilter }).subscribe((res) => {
            this.queries.set(this.keys.get(i), Number(res.result));
            resolve(res.result);
          });
        }),
      );
    }

    Promise.all(promises).then((res) => {
      this.queries.set(this.keys.get(2), this.queries.get('firstOutbound') + this.queries.get('secondOutbound'));
      this.blockUIService.stop('APP');
    });
  }

  handleChangeDateFilter(value: any) {
    this.dateFilter = value;
    this.loadData();
  }
}
