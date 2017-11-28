import {OnInit, Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'select-component',
  template: `
    <select class="form-control" id="{{name}}Edit" name="{{name}}Edit"
            [(ngModel)]="model" (ngModelChange)="onModelChange($event)">
      <option *ngFor="let i of options" value="{{i}}">asd {{i.name}}</option>
    </select>
  `
})
export class SelectComponent {

  @Input() onModelChange = (ev) => {
    this.modelChanged.emit(ev)
  }
  @Output() modelChanged = new EventEmitter();
  @Input() name: any
  @Input() model: any
  @Input() options = []
}
