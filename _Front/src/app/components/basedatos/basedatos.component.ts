import { Component, OnInit, OnDestroy } from '@angular/core';
import { DbapiService } from '../../services/dbapi.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
	selector: 'app-basedatos',
	templateUrl: './basedatos.component.html',
	styleUrls: ['./basedatos.component.css']
})
export class BasedatosComponent implements OnInit, OnDestroy {
	private destroy$: Subject<boolean> = new Subject<boolean>();
	public match: any
	public curTable: String=""
	public curView: String=""
	basesDatos =[]
	public resultado:any
	constructor(
		private dbapi: DbapiService
	) { 

	}
	
	tcampos(e){		
		e && e.preventDefault()
		this.match={tabla:this.curTable, bd:this.dbapi.currentDb}
		console.log(this.curTable)
		this.dbapi.getFields(this.match).pipe(takeUntil(this.destroy$)).subscribe(data=>{
			console.log("Campos:",data)
		}) 
	}

	tviews(e){		
		e && e.preventDefault()
		console.log(this.curView)
		// this.dbapi.getFields(this.frmData).pipe(takeUntil(this.destroy$)).subscribe(data=>{
		// 	this.resultado=data                    
		// 	this.dbapi.views.push(this.resultado.data.rows)
		// }) 
	}

	ngOnInit() {
	}
	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	};

}
