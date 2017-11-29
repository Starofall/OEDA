import {OnInit, Component, EventEmitter} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {LayoutService} from "../../../shared/modules/helper/layout.service";
import {OEDAApiService, Experiment, Target, ExecutionStrategy} from "../../../shared/modules/api/oeda-api.service";
import * as _ from "lodash";
import {UUID} from "angular2-uuid";
import {isNullOrUndefined, isNull, isUndefined} from "util";


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
  modelChanged:  EventEmitter<any>;
  selectedTargetSystem: any;

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
    this.modelChanged = new EventEmitter();
  }

  ngOnInit(): void {
    const ctrl = this;
    ctrl.layout.setHeader("Create an Experiment", "");
    ctrl.api.loadAllTargets().subscribe(
      (data) => {
        if (!isNullOrUndefined(data)) {
          for (let k = 0; k < data.length; k++) {

            // pre-calculate step size
            for (let j = 0; j < data[k]["changeableVariable"].length; j++) {
              data[k]["changeableVariable"][j]["step"] =
                (data[k]["changeableVariable"][j]["max"] - data[k]["changeableVariable"][j]["min"]) / 10;
            }

            ctrl.availableTargetSystems.push(data[k]);
          }
          // default values for target system and changeable variable sections, i.e. 0th element
          // ctrl.targetSystem = ctrl.availableTargetSystems[0];
        } else {
          this.notify.error("Error", "Please create target system first");
        }
      }
    );
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
    console.log(targetSystemName);
    console.log("available", this.availableTargetSystems);
    // TODO target system names must be uniquely defined, should be checked upon target system creation
    this.selectedTargetSystem = this.availableTargetSystems.find(item => item.name === targetSystemName);
    console.log("selected:", this.selectedTargetSystem);

    if (this.selectedTargetSystem !== undefined) {
      console.log("obj:", this.selectedTargetSystem);
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
        ctrl.experiment.changeableVariable.push(variable);
      }
    }
  }

  addAllChangeableVariables() {
    const ctrl = this;
    console.log(ctrl.targetSystem.changeableVariable);
    for (let i = 0; i < ctrl.targetSystem.changeableVariable.length; i++) {
      if (ctrl.experiment.changeableVariable.filter(item => item.name === ctrl.targetSystem.changeableVariable[i].name).length === 0) {
        /* vendor does not contain the element we're looking for */
        ctrl.experiment.changeableVariable.push(ctrl.targetSystem.changeableVariable[i]);
      }
    }
  }

  removeChangeableVariable(index) {
    this.experiment.changeableVariable.splice(index, 1);
  }

  removeAllVariables() {
    this.experiment.changeableVariable.splice(0);
  }

  hasChanges(): boolean {
    return JSON.stringify(this.experiment) !== JSON.stringify(this.originalExperiment);
  }

  saveExperiment() {
    if (!this.hasErrors()) {
      console.log("experiment to be submitted", this.experiment);

      if (this.experiment.changeableVariable.length === 0) {
        this.notify.error("Error", "Variable length cannot be 0");
        return;
      }

      // const knob1 = {};
      // const startEndArray1 = [];
      // startEndArray1.push(this.experiment.changeableVariable[0].min);
      // startEndArray1.push(this.experiment.changeableVariable[0].max);
      // startEndArray1.push(this.experiment.changeableVariable[0].step);
      //
      // const variableName1 = this.experiment.changeableVariable[0].name;
      // Object.defineProperty(knob1, variableName1, {value : startEndArray1,
      //                       writable : true,
      //                       enumerable : true,
      //                       configurable : true});
      //
      // this.experiment.executionStrategy.knobs = knob1;


      const all_knobs = [];
      for (let j = 0; j < this.experiment.changeableVariable.length; j++) {
        const knob = [];
        knob.push(this.experiment.changeableVariable[j].name);
        knob.push(this.experiment.changeableVariable[j].min);
        knob.push(this.experiment.changeableVariable[j].max);
        knob.push(this.experiment.changeableVariable[j].step);
        all_knobs.push(knob);
      }
      this.experiment.executionStrategy.knobs = all_knobs;

      console.log("experiment to be submitted:", this.experiment);

      this.api.saveExperiment(this.experiment).subscribe(
        (success) => {
          console.log("success: ", success);
          this.notify.success("Success", "Experiment saved");
          this.router.navigate(["control/experiments"]).then(() => {
          });
        }, (error) => {
          console.log("error: ", error);
        }
      )
    }
  }

  hasErrors(): boolean {
    const cond1 = this.targetSystem.status === "WORKING";
    const cond2 = this.targetSystem.status === "ERROR";

    const cond3 = this.experiment.changeableVariable == null;
    const cond4 = this.experiment.changeableVariable.length === 0;

    const cond5 = this.experiment.name === null;
    const cond6 = this.experiment.name.length === 0;

    const cond7 = this.experiment.description === null;
    const cond8 = this.experiment.description.length === 0;

    // const cond5 = this.experiment.executionStrategy.knobs.x.step == null;
    //
    // const cond6 = this.experiment.executionStrategy.knobs.y.min == null;
    // const cond7 = this.experiment.executionStrategy.knobs.y.max == null;
    // const cond8 = this.experiment.executionStrategy.knobs.y.step == null;
    //
    // const cond9 = this.experiment.executionStrategy.ignore_first_n_results == null;
    // const cond10 = this.experiment.executionStrategy.knobs.y.step == null;

    return cond1 || cond2 || cond3 || cond4 || cond5 || cond6 || cond7 || cond8;
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
