import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lcon } from '@models';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  lcon: Lcon;
  isLoading = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has('id')) {
        const id = +(params.get('id') || 0);
        if (id) this.getLcon(id);
      }
    });
  }

  getLcon(id: number) {
    this.isLoading = true;
    this.apiService.getLcon(id).subscribe((res) => {
      this.isLoading = false;
      if (res.success) {
        this.lcon = res.result;
      }
    });
  }
}
