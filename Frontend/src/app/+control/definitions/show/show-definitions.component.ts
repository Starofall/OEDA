import {Component, Injectable, OnInit} from '@angular/core';
import {LayoutService} from "../../../shared/modules/helper/layout.service";

@Component({
  selector: 'show-control-definitions',
  templateUrl: './show-definitions.component.html',
})
export class ShowDefinitionsComponent {

  constructor(private layout: LayoutService) {
    this.layout.setHeader("Definitions", "Show Definition")
  }

  definition =  {
    "id": "123131-12312313-12312312-123123",
    "name": "RTX Test Run #1",
    "description": "Testing cool stuff",
    "target": { // target definition (relational)
      "name": "CrowdNav Production"
      // ..
    },
    "status": "SUCCESS",
    "creator": { // user object (relational)
      "name": "Max Mustermann",
      "email": "mustermann@example.com",
      "role": "USER"
    },
    "definition": {},
    // dates
    "createdAt": "2016-01-09T14:48:34-08:00",
    "lastChanged": "2016-01-09T14:48:34-08:00",
    "executedAt": "2016-01-09T14:48:34-08:00",
  }

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

}
