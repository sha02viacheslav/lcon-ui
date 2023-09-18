import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../@core/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { UserService } from '../../@core/services/user.service';

@Component({
  selector: 'ngx-ssoAuth-component',
  templateUrl: './ssoAuth.component.html',
  styleUrls: ['./ssoAuth.component.scss'],
})
export class SsoAuthComponent implements OnInit {
  isAuthenticating = false;
  currentTheme: string;
  constructor(
    private authService: LoginService,
    //private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.onSsoAuth();
  }

  onSsoAuth() {
    this.isAuthenticating = true;

    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.authService.ssoAuth(code).subscribe(
        (res) => {
          this.isAuthenticating = false;
          this.router.navigate(['']);
        },
        (error) => {},
      );
    }
  }
}
