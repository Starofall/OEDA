import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/modules/auth/user.service";
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {DataService} from "../../../shared/util/data-service";

@Component({
  selector: 'user-header',
  templateUrl: './user-header.component.html',
  styles: [`

    .pageDescriptor {
      display: inline-flex;
      height: 55px;
      padding-top: 17px;
      padding-left: 15px;
    }

    .pageDescriptor > h3 {
      padding: 0px;
      margin: 0px;
    }
  `]
})
export class UserHeaderComponent {

  header = {
    name: "",
    description: ""
  }

  constructor(private user: UserService, private layout: LayoutService, public dataService: DataService) {
    this.header = this.layout.header
  }



}
