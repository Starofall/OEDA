import {ErrorHandler, Injector, NgModule} from "@angular/core";
import {SimpleNotificationsModule} from "angular2-notifications";
import {AccordionModule} from 'ng2-bootstrap/accordion';
import {ProgressbarModule} from "ng2-bootstrap/progressbar";
import {PaginationModule} from "ng2-bootstrap/pagination";
import {TabsModule} from "ng2-bootstrap/tabs";
import {ModalModule} from "ng2-bootstrap/modal";
import {BsDropdownModule} from "ng2-bootstrap/dropdown";
import {SortableModule} from "ng2-bootstrap/sortable";
import {PopoverModule} from "ng2-bootstrap/popover";
import {TooltipModule} from "ng2-bootstrap";
import {Angular2FontawesomeModule} from "angular2-fontawesome";

// This module is imported into the app scope only (mainly for libraries that also load a service
// which we do not want to instantiate multiple times

@NgModule({
  imports: [
    Angular2FontawesomeModule,
    SimpleNotificationsModule,
    AccordionModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule.forRoot(),
    SortableModule.forRoot(),
    TooltipModule.forRoot(),
    ProgressbarModule.forRoot()
  ],
  exports: [
    SimpleNotificationsModule
  ],
  providers: [
    // should always be empty
  ]
})
export class GlobalModule {
}
