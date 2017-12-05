import {NgModule} from "@angular/core";
import {SimpleNotificationsModule} from "angular2-notifications";
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {ProgressbarModule} from "ngx-bootstrap/progressbar";
import {PaginationModule} from "ngx-bootstrap/pagination";
import {TabsModule} from "ngx-bootstrap/tabs";
import {ModalModule} from "ngx-bootstrap/modal";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {SortableModule} from "ngx-bootstrap/sortable";
import {PopoverModule} from "ngx-bootstrap/popover";
import {TooltipModule} from "ngx-bootstrap";
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
