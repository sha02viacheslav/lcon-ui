import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { SummaryType } from '../../@core/enums';

@Component({
  selector: 'app-outbound',
  templateUrl: './outbound.component.html',
  styleUrls: ['./outbound.component.scss'],
})
export class OutboundComponent implements OnInit {
  readonly SummaryType = SummaryType;

  isLoading: boolean = true;

  keys = new Map<number, string>()
    .set(0, 'firstOutbound')
    .set(1, 'secondOutbound')
    //.set(2,"primaryLcon")
    //.set(3,"secondaryLcon")
    .set(2, 'totalOutbound');

  params = new Map<string, string>()
    .set(this.keys.get(0), "firstnotificationdate != '' AND secondnotificationdate = ''") // set table to "(select distinct serviceorderid from public.lconsummaryreport) as ordercount"
    .set(this.keys.get(1), "secondnotificationdate != ''");
  //.set(this.keys.get(2),"")
  //.set(this.keys.get(3),"")

  queries = new Map<string, number>();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData() {
    this.isLoading = true;
    for (let i = 0; i < this.params.size; i++) {
      await this.api.getCount(this.params.get(this.keys.get(i))).then((res) => {
        this.queries.set(this.keys.get(i), Number(res.data));
      });
    }
    this.queries.set(this.keys.get(2), this.queries.get('firstOutbound') + this.queries.get('secondOutbound'));
    this.isLoading = false;
  }

  handleChangeDateFilter(value: any) {
    console.log('Change Date Filter', value);
  }
}
