import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Subject, Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class DbapiService {
	conectado:boolean=false
	currentDb:string=''
	tablas=[]
	views=[]
	urlorigin:string='http://localhost:3005'
    credenciales={}
    // public setBoletaSB = new Subject();
    // private _ = '/plgs/_rendi_/';
	private _ = '/poogstrap/';
    
	constructor( 
        private http: HttpClient
    ) { 
        
    };
    conectar(body: Object){
		body = body || {};
		console.log({body: body})
		return this.http.post(this.urlorigin + '/connect', body)
	}
	getTablas(body: Object){
		body = body || {};
		console.log({body: body})
		return this.http.post(this.urlorigin + '/gettables', body)
	}
	getViews(body: Object){
		body = body || {};
		console.log({body: body})
		return this.http.post(this.urlorigin + '/getviews', body)
	}
	getFields(body: Object){
		body = body || {};
		console.log({body: body})
		return this.http.post(this.urlorigin + '/getfields1', body)
	}
	// getMateriales(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'gmateriales', body).map(this.setterFnOk);
	// }
	// getUnidades(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'gunidades', body).map(this.setterFnOk);
	// }
	// getLocaciones(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'glocaciones', body).map(this.setterFnOk);
	// }
	// getPersonas(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'gpersonas', body).map(this.setterFnOk);
	// }
	// getTanques(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'gTanques', body).map(this.setterFnOk);
	// }
	// getBombas(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'gBombas', body).map(this.setterFnOk);
	// }
	// getCargas(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'gCargas', body).map(this.setterFnOk);
	// }
	// getOrdenes(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'gOrdenes', body).map(this.setterFnOk);
	// }
	// getAccesos(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'gAccesos', body).map(this.setterFnOk);
	// }

	// getVehXPersona(body: Object){
	// 	body = body || {};
	// 	return this.http.post(this._ + 'gVehXPersona', body).map(this.setterFnOk);
	// }

	// setMateriales(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'smateriales', body).map(this.setterFnOk);
	// };
	// setUnidades(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'sunidades', body).map(this.setterFnOk);
	// };
	// setLocaciones(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'slocaciones', body).map(this.setterFnOk);
	// };
	// setPersonas(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'spersonas', body).map(this.setterFnOk);
	// };
	// setTanques(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'sTanques', body).map(this.setterFnOk);
	// };
	// setBombas(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'sBombas', body).map(this.setterFnOk);
	// };
	// setCargas(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'sCargas', body).map(this.setterFnOk);
	// };
	// setOrdenes(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'sOrdenes', body).map(this.setterFnOk);
	// };

	// setAccesos(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'sAccesos', body).map(this.setterFnOk);
	// };

	// setAsignacion(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'sAsignacion', body).map(this.setterFnOk);
	// };

	// setAsignacionVeh(body: Object) {
	// 	body = body || {};
	// 	return this.http.post(this._ + 'sAsignacionVeh', body).map(this.setterFnOk);
	// };
}
