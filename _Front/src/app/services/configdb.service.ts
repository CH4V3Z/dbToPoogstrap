import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigdbService {
    mensaje:string="Hola desde el servicio compartido"    
    conectado:boolean=false
    credenciales={
        
    }

    private _ = '/poogstrap/';
    constructor(
        private http: HttpClient,
    ) { }

    conectar(body: Object){
        body = body || {};
		return this.http.post(this._ + 'connect', body)
    }
}
