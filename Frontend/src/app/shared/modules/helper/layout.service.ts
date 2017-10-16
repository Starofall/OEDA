import {Injectable} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Injectable()
export class LayoutService {

  public constructor(private titleService: Title) {
  }


  header = {
    name: "",
    description: ""
  };

  /** user to store the state of the mobile navigation */
  mobileNavigationOpen = false;

  /** sets the UI header with a name and a description*/
  setHeader(name: string, description: string) {
    this.titleService.setTitle(name + " | OEDA ")
    this.header.name = name;
    this.header.description = description
  }
}
