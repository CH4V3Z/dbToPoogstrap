import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { BasedatosComponent } from './components/basedatos/basedatos.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { TableModule } 	from 'ngx-easy-table';


@NgModule({
  declarations: [
    AppComponent,
    ConfiguracionComponent,
    BasedatosComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    TableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
