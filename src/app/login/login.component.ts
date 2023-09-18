import { Component, OnInit, Inject } from '@angular/core';
import { SsoConfig } from '../@core/config.core';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'ngx-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  currentTheme: string;
  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit() {
    this.onSsoLogin();
  }

  onSsoLogin() {
    this.document.location.href = `https://login.microsoftonline.com/906aefe9-76a7-4f65-b82d-5ec20775d5aa/oauth2/v2.0/authorize?client_id=${SsoConfig.clientId}&response_type=${SsoConfig.responseType}&redirect_uri=${SsoConfig.redirectUri}&scope=${SsoConfig.scope}&domain_hint=${SsoConfig.domainHint}`;
  }
}
