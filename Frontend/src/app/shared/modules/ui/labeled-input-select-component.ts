import {OnInit, Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'labeled-input-select',
  template: `

    <div class="col-md-{{colSize}}">
      <div class="sub-title">{{name}}</div>
      <div>
        <select class="form-control" id="{{name}}Edit" name="{{name}}Edit"
                [(ngModel)]="model[key]" (ngModelChange)="onModelChange($event)" size="1">
          <option *ngFor="let i of options; let ind = index;" value="{{i.key}}" selected="ind == 0">{{i.label}}</option>
        </select>
      </div>
    </div>
  `
})
export class LabeledInputSelectComponent {

  @Input() onModelChange = (ev) => {
    this.modelChanged.emit(ev)
  }
  @Output() modelChanged = new EventEmitter();
  @Input() info = null
  @Input() colSize = 6
  @Input() name: any
  @Input() model: any
  @Input() key: string
  @Input() options = []
}
