import {Injectable} from "@angular/core";
import {Constants} from "../../constants";

@Injectable()
export class UtilService extends Constants {

  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1).toLowerCase();
  }

}

