import {OnInit, Component, EventEmitter} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {ActivatedRoute, Router} from "@angular/router";
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {OEDAApiService, Experiment, Target, ExecutionStrategy} from "../../../shared/modules/api/oeda-api.service";
import * as _ from "lodash";
import {UUID} from "angular2-uuid";
import {isNullOrUndefined, isNumber} from "util";


@Component({
  selector: 'control-experiments',
  templateUrl: './create-experiments.component.html',
})
export class CreateExperimentsComponent implements OnInit {
  experiment: Experiment;
  originalExperiment: Experiment;
  availableTargetSystems: any;
  targetSystem: any;
  executionStrategy: any;
  variable: any;
  initialVariables: any;
  selectedTargetSystem: any;
  totalNrOfStages: any;

  constructor(private layout: LayoutService, private api: OEDAApiService,
              private router: Router, private route: ActivatedRoute,
              private notify: NotificationsService) {
    this.availableTargetSystems = [];
    this.initialVariables = [];

    this.targetSystem = this.createTargetSystem();
    // create an empty experiment and execution strategy
    this.executionStrategy = this.createExecutionStrategy();
    this.experiment = this.createExperiment();
    this.originalExperiment = _.cloneDeep(this.experiment);
    this.totalNrOfStages = null;
  }

  ngOnInit(): void {
    const ctrl = this;
    ctrl.layout.setHeader("Create an Experiment", "");
    ctrl.api.loadAllTargets().subscribe(
      (data) => {
        if (!isNullOrUndefined(data)) {
          for (let k = 0; k < data.length; k++) {

            if (data[k]["status"] === "READY") {
              // pre-calculate step size
              for (let j = 0; j < data[k]["changeableVariable"].length; j++) {
                data[k]["changeableVariable"][j]["step"] =
                  (data[k]["changeableVariable"][j]["max"] - data[k]["changeableVariable"][j]["min"]) / 10;
              }
              ctrl.availableTargetSystems.push(data[k]);
            }
          }
        } else {
          this.notify.error("Error", "Please create target system first");
        }
      }
    );
  }

  navigateToTargetSystemPage() {
    this.router.navigate(["control/targets/create"]).then(() => {
      console.log("navigated to target system creation page");
    });
  }

  // assureObjectContract() {
  //   if (this.experiment.primaryDataProvider == null) {
  //     this.experiment.primaryDataProvider = {type: ""}
  //   }
  //   if (this.experiment.changeProvider == null) {
  //     this.experiment.changeProvider = {type: ""}
  //   }
  //   if (this.experiment.incomingDataTypes == null) {
  //     this.experiment.incomingDataTypes = []
  //   }
  //   if (this.experiment.changeableVariable == null) {
  //     this.experiment.changeableVariable = []
  //   }
  // }

  firstDropDownChanged(targetSystemName: any) {
    this.selectedTargetSystem = this.availableTargetSystems.find(item => item.name === targetSystemName);

    if (this.selectedTargetSystem !== undefined) {
      if (this.selectedTargetSystem.changeableVariable.length === 0) {
        this.notify.error("Error", "Target does not contain a changeable variable.");
        return;
      }

      // remove previously added variables if they exist
      if (this.experiment.changeableVariable.length > 0) {
        this.experiment.changeableVariable = this.experiment.changeableVariable.splice();
      }

      if (this.experiment.name != null) {
        this.experiment.name = "";
      }

      // also refresh variable model if anything is left from previous state
      if (this.variable != null) {
        this.variable = null;
      }

      // now copy all changeable variables to initialVariables array
      this.initialVariables = this.selectedTargetSystem.changeableVariable.slice(0);

      this.targetSystem = this.selectedTargetSystem;

      // relate target system with experiment now
      this.experiment.targetSystemId = this.selectedTargetSystem.id;

    } else {
      this.notify.error("Error", "Cannot fetch selected target system, please try again");
      return;
    }
  }

  addChangeableVariable(variable) {
    const ctrl = this;
    console.log("variable to be added", variable);
    if (!isNullOrUndefined(variable)) {
      if (ctrl.experiment.changeableVariable.some(item => item.name === variable.name) ) {
        ctrl.notify.error("Error", "This variable is already added");
      } else {
        ctrl.experiment.changeableVariable.push(_.cloneDeep(variable));
        this.calculateTotalNrOfStages();
      }
    }
  }

  addAllChangeableVariables() {
    const ctrl = this;
    for (let i = 0; i < ctrl.targetSystem.changeableVariable.length; i++) {
      if (ctrl.experiment.changeableVariable.filter(item => item.name === ctrl.targetSystem.changeableVariable[i].name).length === 0) {
        /* vendor does not contain the element we're looking for */
        ctrl.experiment.changeableVariable.push(_.cloneDeep(ctrl.targetSystem.changeableVariable[i]));
      }
    }
    this.calculateTotalNrOfStages();
  }

  // re-calculates number of stages after each change to step size
  stepSizeChanged(stepSize) {
    if (!isNullOrUndefined(stepSize)) {
      this.calculateTotalNrOfStages();
    }
  }

  // if one of min and max is not valid, sets totalNrOfStages to null, so that it will get hidden
  minMaxModelsChanged(value) {
    if (isNullOrUndefined(value)) {
      this.totalNrOfStages = null;
    } else {
      this.calculateTotalNrOfStages();
    }
  }

  calculateTotalNrOfStages() {
    this.totalNrOfStages = null;
    const stage_counts = [];
    for (let j = 0; j < this.experiment.changeableVariable.length; j++) {
      if (this.experiment.changeableVariable[j]["step"] <= 0) {
        this.totalNrOfStages = null;
        break;
      } else if (this.experiment.changeableVariable[j]["step"] > this.experiment.changeableVariable[j]["max"] - this.experiment.changeableVariable[j]["min"]) {
        this.totalNrOfStages = null;
        break;
      } else {
        // TODO: it simply multiplies number of stages for each incoming variable, might be changed
        const stage_count = Math.floor((this.experiment.changeableVariable[j]["max"]
          - this.experiment.changeableVariable[j]["min"]) /
          this.experiment.changeableVariable[j]["step"]);
        stage_counts.push(stage_count);
      }
    }
    if (stage_counts.length !== 0) {
      const sum = stage_counts.reduce(function(a, b) {return a * b; } );
      this.totalNrOfStages = sum;
    }
  }

  removeChangeableVariable(index) {
    this.experiment.changeableVariable.splice(index, 1);
    this.calculateTotalNrOfStages();
  }

  removeAllVariables() {
    this.experiment.changeableVariable.splice(0);
    this.calculateTotalNrOfStages();
  }

  hasChanges(): boolean {
    return JSON.stringify(this.experiment) !== JSON.stringify(this.originalExperiment);
  }

  saveExperiment() {
    if (!this.hasErrors()) {

      if (this.experiment.changeableVariable.length === 0) {
        this.notify.error("Error", "Variable length cannot be 0");
        return;
      }
      const all_knobs = [];
      for (let j = 0; j < this.experiment.changeableVariable.length; j++) {
        const knob = [];
        knob.push(this.experiment.changeableVariable[j].name);
        knob.push(Number(this.experiment.changeableVariable[j].min));
        knob.push(Number(this.experiment.changeableVariable[j].max));
        knob.push(Number(this.experiment.changeableVariable[j].step));
        all_knobs.push(knob);
      }
      this.experiment.executionStrategy.knobs = all_knobs;

      this.experiment.executionStrategy.ignore_first_n_results = Number(this.experiment.executionStrategy.ignore_first_n_results);
      this.experiment.executionStrategy.sample_size = Number(this.experiment.executionStrategy.sample_size);
      console.log("experiment to be submitted", this.experiment);
      // this.api.saveExperiment(this.experiment).subscribe(
      //   (success) => {
      //     this.notify.success("Success", "Experiment saved");
      //     this.router.navigate(["control/experiments/show/" + this.experiment.id + "/running"]).then(() => {
      //       console.log("navigated to newly created experiment running page");
      //     });
      //   }, (error) => {
      //     this.notify.success("Error", error.toString());
      //   }
      // )
    }
  }

  // called for every div that's bounded to *ngIf=!hasErrors() expression.
  hasErrors(): boolean {
    const cond1 = this.targetSystem.status === "WORKING";
    const cond2 = this.targetSystem.status === "ERROR";

    const cond3 = this.experiment.changeableVariable == null;
    const cond4 = this.experiment.changeableVariable.length === 0;

    const cond5 = this.experiment.name === null;
    const cond6 = this.experiment.name.length === 0;

    let cond7: boolean;
    for (let j = 0; j < this.experiment.changeableVariable.length; j++) {
      if (this.experiment.changeableVariable[j]["step"] <= 0) {
        cond7 = true;
        break;
      }
      if (this.experiment.changeableVariable[j]["step"] > this.experiment.changeableVariable[j]["max"] - this.experiment.changeableVariable[j]["min"] ) {
        cond7 = true;
        break;
      }
    }

    // const cond7 = this.experiment.description === null;
    // const cond8 = this.experiment.description.length === 0;

    // const cond5 = this.experiment.executionStrategy.knobs.x.step == null;
    //
    // const cond6 = this.experiment.executionStrategy.knobs.y.min == null;
    // const cond7 = this.experiment.executionStrategy.knobs.y.max == null;
    // const cond8 = this.experiment.executionStrategy.knobs.y.step == null;
    //
    // const cond9 = this.experiment.executionStrategy.ignore_first_n_results == null;
    // const cond10 = this.experiment.executionStrategy.knobs.y.step == null;

    return cond1 || cond2 || cond3 || cond4 || cond5 || cond6 || cond7;
    // || cond9 || cond10;
  }

  createExperiment(): Experiment {
    return {
      "id": UUID.UUID(),
      "name": "",
      "description": "",
      "status": "",
      "targetSystemId": "",
      "executionStrategy": this.executionStrategy,
      "changeableVariable": []
    }
  }

  createTargetSystem(): Target {
    return {
      "id": "",
      "primaryDataProvider": {
        "type": "",
      },
      "changeProvider": {
        "type": "",
      },
      "name": "",
      "status": "",
      "description": "",
      "incomingDataTypes": [],
      "changeableVariable": []
    }
  }

  createExecutionStrategy(): ExecutionStrategy {
    return {
      type: "step_explorer",
      // type: "" --- change to this if we dont want a default value
      ignore_first_n_results: 100,
      sample_size: 100,
      knobs: []
    }
  }

}
