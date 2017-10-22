import {Component, Injectable, OnInit} from '@angular/core';
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {OEDAApiService} from "../../../shared/modules/api/oeda-api.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as _ from "lodash";
import {NotificationsService} from "angular2-notifications/dist";

@Component({
  selector: 'edit-control-definitions',
  templateUrl: './edit-definitions.component.html',
})
export class EditDefinitionsComponent implements OnInit {


  constructor(private layout: LayoutService, private api: OEDAApiService,
              private router: Router, private route: ActivatedRoute,
              private notify: NotificationsService) {

  }
  uiHelper = {
    targetId: null
  }

  definition = null
  originalDefinition = null
  targets = []
  targetSelection = []


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
            this.uiHelper.targetId = this.definition.target.id
            this.originalDefinition = _.cloneDeep(this.definition)

            this.api.loadAllTargets().subscribe(
              (targets) => {
                this.targets = targets
                this.targetSelection = targets.map(x => {
                  return {"key": x.id, "label": x.name}
                })
                this.updateTargetOnDefinition()
              }
            )
          }
        )
      } else {
        // create default
      }
    })


  }

  updateTargetOnDefinition() {
    this.definition.target = this.targets.find(value => value.id === this.uiHelper.targetId)
  }


  hasChanges(): boolean {
    return JSON.stringify(this.definition) !== JSON.stringify(this.originalDefinition)
  }

  saveChanges() {
    if (!this.hasErrors()) {
      this.api.saveDefinitions(this.definition).subscribe(
        (success) => {
          this.originalDefinition = _.cloneDeep(this.definition)
          this.notify.success("Success", "Definition saved")
          // move to the editing of this track
          if (this.router.url.indexOf("/create") !== -1) {
            this.router.navigate(["control/definitions/edit", this.definition.id])
          } else {
            // @todo reload track to see server based changes
          }
        }
      )
    }
  }

  hasErrors(): boolean {
    return false
  }

  revertChanges() {
    this.definition = _.cloneDeep(this.originalDefinition)
  }


}
