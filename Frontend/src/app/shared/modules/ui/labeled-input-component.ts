import {OnInit, Component, Input, EventEmitter, Output, OnChanges, SimpleChanges} from "@angular/core";

@Component({
  selector: 'labeled-input',
  template: `
    <div class="col-md-{{colSize}}" [ngClass]="{'has-error': hasError || errorFunction()}">
      <div class="sub-title">{{name}}</div>
      <div>
        <input (ngModelChange)="onModelChange($event)" *ngIf="inputType == 'number'" class="form-control" type="number"
               id="{{name}}Edit" name="{{name}}-{{key}}"
               [(ngModel)]="model[key]" [min]="minNumber" [max]="maxNumber">
        <input (ngModelChange)="onModelChange($event)" *ngIf="inputType == 'text'" class="form-control" type="text"
               id="{{name}}Edit" name="{{name}}-{{key}}"
               [(ngModel)]="model[key]" placeholder="{{placeholder}}">
      </div>
    </div>
  `
})
export class LabeledInputComponent implements OnChanges {


  @Output() modelChanged = new EventEmitter();
  @Input() info = null
  @Input() inputType = "text"

  @Input() minNumber = 0
  @Input() maxNumber = 100

  @Input() colSize = 6
  @Input() name: any
  @Input() model: any
  @Input() key: string
  @Input() placeholder = ""


  @Input() required = true
  @Input() hasError = false
  @Input() errorFunction = () => {
    if (this.required) {
      return !this.model[this.key]
    } else {
      return false
    }
  }

  @Input() onModelChange = (ev) => {
    this.modelChanged.emit(ev)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.modelChanged.emit(changes)
  }
}
