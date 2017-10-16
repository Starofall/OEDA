import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {LayoutService} from "../../shared/modules/helper/layout.service";

@Component({
  selector: 'control-definitions',
  templateUrl: './definitions.component.html',
})
export class DefinitionsComponent {

  constructor(private layout: LayoutService) {
    this.layout.setHeader("Definitions", "All System Definitions")
  }

  data = [
    {
      "id": "123131-12312313-12312312-123123",
      "name": "RTX Test Run #1",
      "description": "Testing cool stuff",
      "target": { // target definition (relational)
        "name": "CrowdNav Production"
        // ..
      },
      "creator": { // user object (relational)
        "name": "Max Mustermann",
        "email": "mustermann@example.com",
        "role": "USER"
      },
      "definition": {},
      "createdAt": "2016-01-09T14:48:34-08:00"
    },
    {
      "id": "123131-12312313-12312312-3213123",
      "name": "CrowdNav Optimization",
      "description": "Testing even more cool stuff",
      "target": { // target definition (relational)
        "name": "CrowdNav Staging"
        // ..
      },
      "creator": { // user object (relational)
        "name": "Max Mustermann",
        "email": "mustermann@example.com",
        "role": "USER"
      },
      "definition": {},
      // dates
      "createdAt": "2016-01-09T14:48:34-08:00"
    }
  ]
}
