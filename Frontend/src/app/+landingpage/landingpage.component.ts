import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../shared/modules/helper/layout.service";
import {UserEntity, OEDAApiService} from "../shared/modules/api/oeda-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TempStorageService} from "../shared/modules/helper/temp-storage-service";
import {EntityService} from "../shared/util/entity-service";
import {LoginRequest, UserService} from "../shared/modules/auth/user.service";

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styles: [`
    /deep/
    body {
      background: url(../../assets/img/background2.jpg);
      background-size: cover;
      background-color: #444;
    }

    .vertical-offset-100 {
      padding-top: 100px;
    }
    

  `]
})
export class LandingpageComponent {
  public user: UserEntity;

  constructor(private layout: LayoutService,
              private temp_storage: TempStorageService,
              private api: OEDAApiService,
              private router: Router,
              private entityService: EntityService,
              private notify: NotificationsService,
              private userService: UserService) {
    this.user = this.entityService.create_user_entity();
  }

  public submitRegistration() {
    if (this.user.name.length !== 0 && this.user.password.length !== 0) {
      this.api.registerUser(this.user).subscribe(
        (success) => {
          this.notify.success("Success", "You are registered successfully.");
        }
      )
    } else {
      this.notify.error("Error", "Please provide valid inputs for login.");
    }
  }

  public submitLogin() {
    const ctrl = this;
    if (ctrl.user.name.length !== 0 && ctrl.user.password.length !== 0) {
      const loginRequest: LoginRequest = {
        username: this.user.name,
        password: this.user.password
      };
      ctrl.userService.login(loginRequest).subscribe(
        (userServiceResponse) => {
          if (userServiceResponse === true) {
            ctrl.router.navigate(['/control/experiments']);
            ctrl.notify.success("Success", "You are signed-in successfully.");
          }
        }
      )
    } else {
      this.notify.error("Error", "Please provide valid inputs for login.");
    }

  }
}
