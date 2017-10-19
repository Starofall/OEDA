import {Component, Injectable, OnInit} from '@angular/core';
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../../shared/modules/api/oeda-api.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'edit-control-definitions',
  templateUrl: './edit-definitions.component.html',
})
export class EditDefinitionsComponent implements OnInit {


  constructor(private layout: LayoutService, private api: OEDAApiService, private router: Router, private route: ActivatedRoute) {
  }


  definition = null

  experiments = [{
    id: "123123-12312312-123132",
    status: "SUCCESS",
    startedAt: Date.now(),
    finishedAt: Date.now(),
  },
    {
      id: "123123-12312312-123132",
      status: "RUNNING",
      startedAt: Date.now(),
      finishedAt: null,
    },
    {
      id: "123123-12312312-123132",
      status: "FAILURE",
      startedAt: Date.now(),
      finishedAt: Date.now(),
    }]

  ngOnInit(): void {
    this.layout.setHeader("Definitions", "Edit Definition")
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.api.loadDefinitionsById(params['id']).subscribe(
          (data) => {
            this.definition = data
          }
        )
      } else {
        // create default
      }
    })
  }


}
