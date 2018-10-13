import { Component } from '@angular/core';
import { DbapiService } from './services/dbapi.service'



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'dbToPoogstrap';
    constructor(
        private dbapi: DbapiService        
    ) {

    }
}
