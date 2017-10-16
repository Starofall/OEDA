import {Component, Injectable, OnInit} from '@angular/core';
import {NotificationsService} from "angular2-notifications";

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

}
