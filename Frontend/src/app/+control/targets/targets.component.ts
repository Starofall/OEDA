import {Component, Injectable, OnInit} from '@angular/core';
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {TempStorageService} from "../../shared/modules/helper/temp-storage-service";
import {OEDAApiService} from "../../shared/modules/api/oeda-api.service";
import {Router} from "@angular/router";
import {UserService} from "../../shared/modules/auth/user.service";


@Component({
  selector: 'control-targets',
  templateUrl: './targets.component.html',
})
export class TargetsComponent implements OnInit {
  public is_db_configured: boolean;

  constructor(private layout: LayoutService,
              private temp_storage: TempStorageService,
              private api: OEDAApiService,
              private router: Router,
              private userService: UserService) {
    // redirect user to configuration page if it's not configured yet.
    this.is_db_configured = userService.is_db_configured();
  }

  targets = [];

  ngOnInit(): void {
    this.layout.setHeader("Target System", "Experimental Remote Systems");
    if (this.userService.is_db_configured()) {
      this.api.loadAllTargets().subscribe(
        (data) => {
          this.targets = data;
          const new_target = this.temp_storage.getNewValue();
          if (new_target) {
            // this is needed because the retrieved targets might already contain the new one
            if (!(this.targets.find(t => t.id == new_target.id))) {
              this.targets.push(new_target);
            }
            this.temp_storage.clearNewValue();
          }
        }
      )
    }
  }

  navigateToConfigurationPage() {
    this.router.navigate(["control/configuration"]);
  }

}
