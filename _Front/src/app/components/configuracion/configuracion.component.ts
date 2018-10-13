import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http"
import { DbapiService } from '../../services/dbapi.service'
// import { ConfigdbService } from '../../services/configdb.service'

@Component({
    selector: 'app-configuracion',
    templateUrl: './configuracion.component.html',
    styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit, OnDestroy {
    private destroy$: Subject<boolean> = new Subject<boolean>();
    resultado:any
    constructor(
        private dbapi: DbapiService
        // public dbapi: ConfigdbService

    ) { }

    ngOnInit() { 
    }

    frmData={
        tipodb:"",
        ip:"35.225.221.214",
        puerto:"5432",
        usr:"postgres",
        pwd:"t1v13agle",
        db:"eagledb"
    }
    salvar(){
        this.dbapi.credenciales=this.frmData
        console.log(this.dbapi.credenciales)
    }

    conectar(){
        this.dbapi.conectar(this.frmData).pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.resultado=data
            if(this.resultado.type=="Ok"){
                this.dbapi.conectado=true;
                this.dbapi.currentDb=this.frmData.db
                this.dbapi.getTablas(this.frmData).pipe(takeUntil(this.destroy$)).subscribe(data=>{
                    this.resultado=data                    
                    this.dbapi.tablas.push(this.resultado.data.rows)
                })
                this.dbapi.getViews(this.frmData).pipe(takeUntil(this.destroy$)).subscribe(data=>{
                    this.resultado=data                    
                    this.dbapi.views.push(this.resultado.data.rows)
                }) 
            }else{
                this.dbapi.conectado=false;
            }
            
		});
    }

    ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	};

}
