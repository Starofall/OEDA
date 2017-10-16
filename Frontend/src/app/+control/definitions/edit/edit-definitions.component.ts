import {Component, Injectable, OnInit} from '@angular/core';
import {LayoutService} from "../../../shared/modules/helper/layout.service";

@Component({
  selector: 'edit-control-definitions',
  templateUrl: './edit-definitions.component.html',
})
export class EditDefinitionsComponent {

  constructor(private layout: LayoutService) {
    this.layout.setHeader("Definitions", "Edit Definitions")
  }


  definition = {

  }
}
