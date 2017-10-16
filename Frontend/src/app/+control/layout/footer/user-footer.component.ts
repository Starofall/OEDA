import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/modules/auth/user.service";

@Component({
  selector: 'user-footer',
  templateUrl: './user-footer.component.html'
})
export class UserFooterComponent implements OnInit {

  constructor(private user: UserService) {
  }

  sessionExpires: Date;
  email: string;

  ngOnInit() {
    this.sessionExpires = this.user.sessionExpiresDate()
    this.email = this.user.getAuthToken().map(t => t.email).getOrElse(() => "")
  }

}
