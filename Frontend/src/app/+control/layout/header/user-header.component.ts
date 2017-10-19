import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/modules/auth/user.service";
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {DataService} from "../../../shared/util/data-service";
import {OEDAApiService} from "../../../shared/modules/api/oeda-api.service";

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

  runningExperiments = []

  constructor(private user: UserService, private layout: LayoutService, api: OEDAApiService) {
    this.header = this.layout.header
    api.loadAllExperiments().subscribe(
      (data) => {
        this.runningExperiments = data.filter(value => value.status === "RUNNING")
      }
    )
  }


}
