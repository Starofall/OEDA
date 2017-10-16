import {OnInit, Component, Input, HostListener} from "@angular/core";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'debug-element',
  template: '<pre *ngIf="showDebug && !isProduction">{{element|json}}</pre>'
})

export class DebugElementComponent {

  @Input() element

  showDebug = false

  isProduction = environment.production

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event.key === 'F9') {
      this.showDebug = !this.showDebug
    }
  }

}
