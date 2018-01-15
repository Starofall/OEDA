import {Component} from '@angular/core';
import {JWTToken, UserService} from "../../shared/modules/auth/user.service";
import {LayoutService} from "../../shared/modules/helper/layout.service";

@Component({
  selector: 'user-layout',
  templateUrl: 'user-layout.component.html'
})
export class UserLayoutComponent {

  private FOOTER_HEIGHT = 44;
  contentHeight: number;

  token: JWTToken;

  constructor(private userService: UserService) {
    this.contentHeight = window.innerHeight - this.FOOTER_HEIGHT;
    this.token = userService.getAuthToken().getOrElse(() => null)
  }
}
