import {Component, Injectable, OnInit} from '@angular/core';
import {LayoutService} from "../../shared/modules/helper/layout.service";
import {TempStorageService} from "../../shared/modules/helper/temp-storage-service";
import {OEDAApiService} from "../../shared/modules/api/oeda-api.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'control-targets',
  templateUrl: './targets.component.html',
})
export class TargetsComponent implements OnInit {

  constructor(private layout: LayoutService,
              private temp_storage: TempStorageService,
              private api: OEDAApiService,
              private router: ActivatedRoute) {
  }

  targets = [];

  ngOnInit(): void {
    this.layout.setHeader("Target System", "Experimental Remote Systems");
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
