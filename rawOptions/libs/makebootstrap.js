let boots = {};
boots.make = (data,translate, tablename)=>{
	let tskey = translate.split('.')[translate.split('.').length -1 ];
	let datos = {
		hasSetter : true,
		setters : [],
		hasTags :false,
		hasMailValidators : false,
		hasErrorMessages : false,
		hasPhone: false,
		hasCianid:false,  //=> Determina si esta tabla requiere ID de Compañia
		primarysKeys:[],
		tskeyCapitalize: tskey.charAt(0).toUpperCase() + tskey.slice(1),
		table : [],		//->campos para la tabla HTML
		columns : [],  //->definicion de tabla en el controller
		requireds: [],
		tagsToText: [],
		tagEdit: 	[],
		retursPrimaryskey:[],
		allFields : [],
	}
	let js = [];
	let traduccion = [];
	let traduccion_ph = [];
	let traduccion_th = [];
	let traduccion_rq = [];
	let frmdata = [];

	let html = `
	`; //==>> Guarda el resultado final del HTML

	// Elementos HTML
	let elements = [];

	data.forEach(column => {
		let valor;
		datos.hasCianid = datos.hasCianid || column.columna == 'cia_nid';
		datos.allFields.push(column.columna);
		datos.table.push(`ngx-datatable-column(name="{{'frm.${tskey}.${column.columna}' | translate}}", prop="${column.columna}", [width]='auto')`);
		// datos.columns.push(`ngx-datatable-column(name="{{'frm.${tskey}.${column.columna}' | translate}}", prop="${column.columna}", [width]='auto')`);
		elements.push(`//- *********** ${column.columna} ************ -//`);

		if (column.primario == '1') {
			elements.push("//- PrimaryKey Hiden");
			elements.push(`input.form-control(type="hidden", readonly, [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`);
			elements.push("//- PrimaryKey Visible");
			elements.push(".form-group");
			elements.push(`\tlabel {{'${translate}.${column.columna}' | translate}} :`);
			elements.push(`\tinput.form-control(type="number", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", readonly, [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)


			valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? parseInt(column.predeterminado) : 0;

			// datos.retursPrimaryskey.push(`x.datos.rows && x.datos.rows[0] && x.datos.rows[0].${column.columna} && (this.frmdata.${column.columna} = x.datos.rows[0].${column.columna});`);
			datos.retursPrimaryskey.push(`x.datos.recordset && x.datos.recordset[0] && x.datos.recordset[0].lastid && (this.frmdata.${column.columna} = x.datos.recordset[0].lastid);`);

			datos.requireds.push(`!this.fwk.validInt(this.frmdata.${column.columna}, 0, null) && ( (paso = false) || this.fwk.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)

			datos.primarysKeys.push(column.columna);
		}else{
			elements.push(".form-group");
			elements.push(`\tlabel {{'${translate}.${column.columna}' | translate}} :`);
			switch (column.datatype) {
				case 'int':
					elements.push(`\t.input-group.with-focus`)
					elements.push(`\t\tinput.form-control(type="number",required ,min="-2147483648", max="2147483647", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}",#${column.columna} = "ngModel" ,name="${column.columna}")`)
					elements.push(`\t.text-danger(*ngIf="${column.columna}.errors?.required && (${column.columna}.dirty || ${column.columna}.touched)") {{'${translate}.${column.columna}_rq' | translate}}`)
					datos.requireds.push(`!this.fwk.validInt(this.frmdata.${column.columna}, 0, 2147483647) && ( (paso = false) || this.fwk.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
					valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? parseInt(column.predeterminado) : 0;
					break;
				case 'varchar':
					elements.push(`\t.input-group.with-focus`)
					elements.push(`\t\tinput.form-control(type="text", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]="frmdata.${column.columna}", name="${column.columna}", #${column.columna}="ngModel", required, minlength="2", maxlength="${column.maxlength}")`)
					elements.push(`\t.text-danger(*ngIf="(${column.columna}.errors?.required || ${column.columna }.errors ?.minlength) && (${column.columna}.dirty || ${column.columna}.touched)") {{'${translate}.${column.columna}_rq' | translate}}`)

					datos.requireds.push(`!this.fwk.validString(this.frmdata.${column.columna}, 2, ${column.maxlength}) && ( (paso = false) || this.fwk.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
					if (column.columna.indexOf('mail')>-1) {
						datos.setters.push(`\t${column.columna} : [] `); //=> agregar el setter

						elements.push("\t//- Tags Options for emails");
						elements.push("\tbr")
						elements.push(`\ttag-input([(ngModel)]="setters.${column.columna}", theme='minimal', secondaryPlaceholder="{{'${translate}.${column.columna}_ph' | translate}}" , placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [validators]="fwk.mailValidator", [errorMessages]="errorMessages", name="${column.columna}", [maxItems]="6")`)
						datos.hasTags = true;
						datos.hasSetter = true;
						datos.hasMailValidators = true;
						datos.hasErrorMessages = true;
						// datos.tagEdit.push(`this.setters.${column.columna} = this.frmdata.cia_vmails.split('_&&_').map(x => {return {display: x,value: x}});`);
					}
					if (column.columna.indexOf('phone') > -1 || column.columna.indexOf('telf') > -1 ) {
						datos.setters.push(`\t${column.columna} : [] `); //=> agregar el setter

						elements.push("\t//- Tags Options for Phones");
						elements.push("\tbr")
						elements.push(`\ttag-input([(ngModel)]="setters.${column.columna}", theme='minimal', secondaryPlaceholder="{{'${translate}.${column.columna}_ph' | translate}}" , placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [validators]="fwk.phoneValidator", [errorMessages]="errorMessages", name="${column.columna}", [maxItems]="6")`)
						datos.hasTags = true;
						datos.hasSetter = true;
						datos.hasErrorMessages = true;
						datos.hasPhone = true;

					}
					if (column.columna.indexOf('mail') > -1 || column.columna.indexOf('phone') > -1 || column.columna.indexOf('telf') > -1) {
						datos.table.pop();
						datos.table.push(`ngx-datatable-column(name="{{'frm.${tskey}.${column.columna}' | translate}}", [width]='auto')`);
						datos.table.push(`\tng-template(let-row="row", ngx-datatable-cell-template="")`);
						datos.table.push(`\t\tspan {{row.${column.columna}.split('_&&_').join('; ')}}`);

						datos.requireds.push(`this.frmdata.${column.columna}.split('_&&_').length < 1  && ( (paso = false) || this.fwk.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
						datos.tagsToText.push(`this.frmdata.${column.columna} = this.setters.${column.columna}.length > 0 ? this.setters.${column.columna}.map(e => e.value).join('_&&_') : "";`)

						datos.tagEdit.push(`let exploded_${column.columna} = this.frmdata.${column.columna}.split('_&&_').filter(x=> x!== "");`);
						datos.tagEdit.push(`exploded_${column.columna}.length > 0 && (this.setters.${column.columna} = exploded_${column.columna}.map(x => { return { display: x, value: x } }))`);
					}
					// agreguemos otrasCosas
					valor = column.predeterminado ? (column.predeterminado == "''" ? '\"\"' : column.predeterminado) : " \'\' ";
					break;

				case 'numeric':
					let number = [];
					if (column.scala == 0) {
						for (let index = 0; index < column.nsize; index++) {
							number.push('9');
						};
						datos.requireds.push(`!this.fwk.validInt(this.frmdata.${column.columna}, 0, null) && ( (paso = false) || this.fwk.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
					}else{
						for (let index = 0; index < column.nsize; index++) {
							if (index == (column.nsize - column.scala)) {
								number.push('.')
							};
							number.push('9');
						};
						datos.requireds.push(`!this.fwk.validNumber(this.frmdata.${column.columna}, 0, null) && ( (paso = false) || this.fwk.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
					}
					let format = number.join('');
					elements.push(`\t.input-group.with-focus`)
					elements.push(`\t\tinput.form-control(type="number",min="-${format}", max="${format}", step="any", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", #${column.columna}="ngModel", name="${column.columna}")`)
					elements.push(`\t\tinput.form-control(type="number",min="0.00", max="${format}", step="any", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", #${column.columna}="ngModel", name="${column.columna}")`)
					elements.push(`\t.text-danger(*ngIf="(${column.columna}.errors?.required ) && (${column.columna}.dirty || ${column.columna}.touched)") {{'${translate}.${column.columna}_rq' | translate}}`)

					if (column.nsize == 1 && column.scala ==0) {
						elements.push("\t//- CheckBoxsOptions");
						elements.push("\tbr")
						elements.push("\tlabel.radio-inline.c-radio")
						elements.push(`\t\tinput#inlineradio1(type="radio", name="${column.columna}", value="0", [(ngModel)]="frmdata.${column.columna}", checked="checked")`)
						elements.push(`\t\tspan.fa.fa-circle`)
						elements.push(`\t\t| {{'${translate}.${column.columna}0' | translate}}`)
						elements.push("\tbr")
						elements.push("\tlabel.radio-inline.c-radio")
						elements.push(`\t\tinput#inlineradio1(type="radio", name="${column.columna}", value="1", [(ngModel)]="frmdata.${column.columna}" )`)
						elements.push(`\t\tspan.fa.fa-circle`)
						elements.push(`\t\t| {{'${translate}.${column.columna}1' | translate}}`)

						// elements.push('\tbr\n\r\tbr')
						elements.push("//- Checkboxs segundaOpcion");
						elements.push(`.form-group`);
						elements.push(`\tlabel {{'${translate}.${column.columna}' | translate}}`)
						elements.push(`\t.form-check.abc-checkbox.abc-checkbox-danger.abc-checkbox-circle`);
						elements.push(`\t\tinput(class="form-check-input", id="${column.columna}0",name="${column.columna}",[(ngModel)]="frmdata.${column.columna}", value="0", type="radio", checked)`);
						elements.push(`\t\tlabel(class="form-check-label" for="${column.columna}0") {{'${translate}.${column.columna}0' | translate}} `);
						elements.push(`\t.form-check.abc-checkbox.abc-checkbox-danger.abc-checkbox-circle`);
						elements.push(`\t\tinput(class="form-check-input", id="${column.columna}1",name="${column.columna}",[(ngModel)]="frmdata.${column.columna}", value="1", type="radio")`);
						elements.push(`\t\tlabel(class="form-check-label" for="${column.columna}1") {{'${translate}.${column.columna}1' | translate}} `);
						traduccion.push(`\t${column.columna}0 : "Inactivo"`)
						traduccion.push(`\t${column.columna}1 : "Activo"`)
						valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? "'" + parseFloat(column.predeterminado) + "'"  : "'0'";
					}else{
						valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? parseFloat(column.predeterminado) : 0.00;
					}
					break;
				case 'bit':
					elements.push("\t//- CheckBoxsOptions");
					elements.push("\tbr")
					elements.push("\tlabel.c-radio")
					elements.push(`\t\tinput#inlineradio1(type="radio", name="${column.columna}", value="0", [(ngModel)]="frmdata.${column.columna}", checked="checked")`)
					elements.push(`\t\tspan.fa.fa-check`)
					elements.push(`\t\t| {{'${translate}.${column.columna}0' | translate}}`)
					elements.push("\tlabel.c-radio")
					elements.push(`\t\tinput#inlineradio1(type="radio", name="${column.columna}", value="1", [(ngModel)]="frmdata.${column.columna}" )`)
					elements.push(`\t\tspan.fa.fa-check`)
					elements.push(`\t\t| {{'${translate}.${column.columna}1' | translate}}`)

					// // elements.push('\tbr\n\r\tbr')
					// elements.push("//- Checkboxs segundaOpcion");
					// elements.push(`.form-group`);
					// elements.push(`\tlabel {{'${translate}.${column.columna}' | translate}}`)
					// elements.push(`\t.form-check.abc-checkbox.abc-checkbox-danger.abc-checkbox-circle`);
					// elements.push(`\t\tinput(class="form-check-input", id="${column.columna}0",name="${column.columna}",[(ngModel)]="frmdata.${column.columna}", value="0", type="radio", checked)`);
					// elements.push(`\t\tlabel(class="form-check-label" for="${column.columna}0") {{'${translate}.${column.columna}0' | translate}} `);
					// elements.push(`\t.form-check.abc-checkbox.abc-checkbox-danger.abc-checkbox-circle`);
					// elements.push(`\t\tinput(class="form-check-input", id="${column.columna}1",name="${column.columna}",[(ngModel)]="frmdata.${column.columna}", value="1", type="radio")`);
					// elements.push(`\t\tlabel(class="form-check-label" for="${column.columna}1") {{'${translate}.${column.columna}1' | translate}} `);
					traduccion.push(`\t${column.columna}0 : "NO"`)
					traduccion.push(`\t${column.columna}1 : "SI"`)
					valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? "'" + parseFloat(column.predeterminado) + "'" : "'0'";
					break;
				default:
					break;
			}
		}
		frmdata.push(`\t${column.columna} : ${valor} `);
		traduccion.push(`\t${column.columna} : "${column.columna}"`)
		traduccion_ph.push(`\t${column.columna}_ph : "${column.columna}_txt" `)
		traduccion_th.push(`\t${column.columna}_th : "${column.columna}_txt" `)
		traduccion_rq.push(`\t${column.columna}_rq : "${column.columna}_txt es invalido" `)

		elements.push("\r\n")
	});
	traduccion_ph.push(`\t${tskey}txtlabel : "${tskey}txtlabel" `)
	traduccion_ph.push(`\t${tskey}txtph : "${tskey}txtph" `)
	traduccion_ph.push(`\ttit : "${datos.tskeyCapitalize}" `)
	traduccion_ph.push(`\frmtit : "Formulario ${datos.tskeyCapitalize}" `)
	let pugResul = elements.join('\r\n\t\t\t\t\t\t\t\t')

	let structable = {};
	data.forEach(column => {
		structable[column.columna] = column;
	});

	js.push('\t\t\tpublic frmdata = {');
	js.push('\t\t\t' + frmdata.join(',\r\n\t\t\t'));
	js.push('\t\t\t};');

	if (datos.hasSetter) {
		js.push('\t\t\tpublic setters = {');
		js.push('\t\t\t' + datos.setters.join(',\r\n\t\t\t'));
		js.push('\t\t\t};');
	}

	let externos = [];
	externos.push(`\t\t\t${tablename} :` + JSON.stringify(structable, null,'\t') );


	externos.push(`\t\t\t${tskey} : {`);
	externos.push(`\t\t\t` + traduccion.join(',\r\n\t\t\t') + ',\r\n\t\t\t' + traduccion_ph.join(',\r\n\t\t\t') + ',\r\n\t\t\t' + traduccion_th.join(',\r\n\t\t\t') + ',\r\n\t\t\t' + traduccion_rq.join(',\r\n\t\t\t') );
	externos.push('\t\t\t},');

	if (datos.hasTags) {
		if (datos.hasErrorMessages) {
			js.push(`\t\t\tpublic errorMessages = {`);
			if (datos.hasMailValidators) {
				js.push(`\t\t\t\t'mailValidator': this.translate.instant('msg.mailerror'),`);
			}
			if (datos.hasPhone) {
				js.push(`\t\t\t\t'phoneValidator': this.translate.instant('msg.phoneerror'),`);
			}
			js.push(`\t\t\t};`);
		}
	};

	selectControl = `
			import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
			import { RamdataService } from '@shared/services/ramdata.service';
			import { FrmworkService } from '@shared/services/frmwork.service';
			import { SettingsService } from '@core/settings/settings.service';
			import { Subject } from 'rxjs/Subject';

			@Component({
				selector: 'app-${tskey}text',
				template: \`
					<ng-select
					[items]="items"
				placeholder = "{{placeholder}}"
				[searchable] = "isSearchable"
				[searchFn] = "_buscar"
					(clear) = "_clear()"
						(change) = "_onChange($event)"
				loadingText = "Bigtrack ... "
				[(ngModel)] = "_value"
					>
					<ng-template ng-option-tmp let-item="item">
						{{ item.label }}:{{ item.id }}<br />
						<small>{{ item.text }}</small>
					</ng-template>
					</ng-select >
				\`
			})
			export class ${datos.tskeyCapitalize}textComponent implements OnInit {
				private destroy$: Subject<boolean> = new Subject<boolean>();
				public items: Array<Object> = [];
				public _filtro: Object = null;
				public _value: Object = {};
				public rawData = [];

				@Input() placeholder: String = "Seleccione &&&&&";
				@Input() isSearchable:boolean = true;

				public lastValue:object = null
				@Input("value")
				set value(e: Object) {
					this.applyFilter(e);
					this.lastValue = e;
				};
				applyFilter(e){
					if (e && e["${datos.primarysKeys[0]}"]) {
						let rw: any = this.rawData.find( (el:any) => el.hasOwnProperty('${datos.primarysKeys[0]}') && el['${datos.primarysKeys[0]}'] == e['${datos.primarysKeys[0]}'] );
						if (rw !== undefined) {
							this._value = {
								id: rw.${datos.primarysKeys[0]},
								label: rw.labelField&&&,
								text: rw.textField&&&,
							};
							return;
						}
					}
					this._value = {};
				}

				@Input("filtro")
				set filtro(e: Object) {
					let ittm = this.items;
					if (!!e) {
						this._filtro = e;
						ittm = this.dataTransform(this.rawData);
					}else{
						!!this._filtro && (this._filtro = null) || (ittm  = this.dataTransform(this.rawData))
						this._filtro = null;
					}
					this.items = [...ittm];
				}
				@Output()
				onChange = new EventEmitter();
				constructor(public fwk: FrmworkService, public ram: RamdataService, private setting :SettingsService) {}
				_onChange(e){
					try {
						if (!e) { this.onChange.emit(null); return; }
						let rw: any = this.rawData.find((el: any) => el.hasOwnProperty('${datos.primarysKeys[0]}') && el['${datos.primarysKeys[0]}'] == e['id']);
						this.onChange.emit(rw);
					} catch (error) {
						console.error(error);
					}
				}
				_clear(){
					this.onChange.emit(null);
				}
				_buscar(term: string, item: any) {
					try{
						!!term && (term = term.toLocaleLowerCase());
						return item.label.toLocaleLowerCase().indexOf(term) > -1 || item.text.toLocaleLowerCase().indexOf(term) >-1 || item.id.toString() == term;
					}catch(ex){
						return false;
					}
				}
				dataTransform(data:Array<{}>):Array<{}>{
					try {
						let filtered = data;
						if (this._filtro) {
							filtered = data.filter(el=>{
								for (const key in this._filtro) {
									if(el.hasOwnProperty(key)){
										if (el[key] !== this._filtro[key]) return false;
									}else{
										return false;
									}
								}
								return true;
							});
						}
						return filtered.map(el=> {
							return {
								id: el['${datos.primarysKeys[0]}'],
								label: el['labelField&&&'],
								text: el["textField&&&"]}
						});
					} catch (error) {
						console.error(error);
						return [];
					}
				}
				ngOnInit() {

					this.ram.getDatos("${tskey}").takeUntil(this.destroy$).subscribe(data => {
						this.rawData = data;
						this.items = [...this.dataTransform(data)];
						this.applyFilter(this.lastValue);
					});
				}
				ngOnDestroy() {
					this.destroy$.next(true);
					this.destroy$.unsubscribe();
				};
			}
`

	html = `
	doctype html
	html
	head
		script(type='text/javascript')
			import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy, NgZone } from '@angular/core';
			import { TranslateService } from '@ngx-translate/core';

			import { FrmworkService } from "@shared/services/frmwork.service";
			import { CommunicatorService } from "@shared/services/communicator.service";
			import { RamdataService } from "@shared/services/ramdata.service";
			import { SettingsService } from "@core/settings/settings.service";
			import { DatatableComponent } from "@swimlane/ngx-datatable"

			import { Subject } from 'rxjs/Subject';
			import { BehaviorSubject } from 'rxjs/BehaviorSubject';
			const swal = require('sweetalert');
			declare let jQuery: any;
			@Component({
				selector: 'app-${tablename}',
				templateUrl: './${tablename}.component.html',
				styleUrls: ['./${tablename}.component.scss']
			})
			export class ${datos.tskeyCapitalize}Component implements OnInit, OnDestroy {
				private destroy$: Subject<boolean> = new Subject<boolean>();
				public rows = [];
				public filterRslt = [];
				public filterstr = "";
				public filterTimer = null;
				loadingIndicator: boolean = true;

				${js.join('\r\n')}

				// public isSuper = false; // =>> Si la tabla requiere identificacion por Compañias

				@ViewChild("table") table : DatatableComponent;
				constructor(
					public fwk: FrmworkService, private translate: TranslateService,
					public ram: RamdataService, public communicator: CommunicatorService,
					public settings: SettingsService,
					public zn: NgZone){

					// Si la tabla requiere identificacion por Compañias
					${datos.hasCianid ?`this.settings.credencialesS.takeUntil(this.destroy$).subscribe(x=>{
						try{
							this.frmdata.cia_nid = x['user']['cia_nid'];
						}catch(ex){
							this.frmdata.cia_nid = 0;
						}
					});`:''}

					this.ram.getDatos("${tskey}").takeUntil(this.destroy$).subscribe(data => {
						zn.run(()=>{
							this.rows = data;
							this.updateFilter(null);
						});
					});
					this.resetForm(null);
				}

				editBtn(e,rw){
					e && e.preventDefault();

					this.resetForm(null);
					for (let key in rw) {
						if (this.frmdata.hasOwnProperty(key)) {
							this.frmdata[key] = rw[key];
						}
					};
					this.frmdata.**_bsts = rw.**_bsts ? '1' : '0';
					// Sugerencia de edicion pata los tags
					${datos.tagEdit.join('\r\n\t\t\t\t')}
				};
				viewBtn(e, rw) {
					e && e.preventDefault();
				};
				delBtn(e, rw) {
					e && e.preventDefault();
					// if (rw.ESTADO  !=  0) {
					// 	swal(
					// 		'Ops',
					// 		this.translate.instant('ALGUN ERROR POR RESTRICCION DE BORRADO'),
					// 		'warning'
					// 	)
					// 	return;
					// }
					swal({
						title: this.translate.instant('rotulos.swal.deltit'),
						text: this.translate.instant('rotulos.swal.delquest'),
						type: 'warning',
						showCancelButton: true,
						confirmButtonText: this.translate.instant('rotulos.swal.yesdel'),
						cancelButtonText: 'No.'
					}).then((result) => {
						if (result.value) {
							this.communicator.del${datos.tskeyCapitalize}(rw).subscribe(x => {
								// console.log(x);
								if (x.hasOwnProperty('type') && x['type'] == 'ok') {
									swal(
										'Deleted',
										'Ok!',
										'success'
									)
								}else{
									swal(
										'Ops',
										this.translate.instant(x['msg']) || "Somthing wrong...",
										'warning'
									)
								}
							});
						}
					});
				};
				saveBtn(e) {
					e && e.preventDefault();
					// ***** los tags a String en caso que existan
					${datos.tagsToText.join('\r\n\t\t\t\t')}
					// *******************************************************
					// VALIDAR LA INFORMACION ANTES DE HACER EL POST
					// *******************************************************
					let paso = true;
					${datos.requireds.join('\r\n\t\t\t\t')}

					if	(paso){
						this.communicator.set${datos.tskeyCapitalize}(this.frmdata).subscribe(x => {
							${datos.retursPrimaryskey.join('\r\n\t\t\t\t\t\t')}
						});
					}
				};
				resetForm(e) {
					e && e.preventDefault();
					// resetear con la formdata
				};
				updateFilter(e) {
					this.loadingIndicator = true;
					e && e.hasOwnProperty('preventDefault') && e.preventDefault();
					this.filterTimer && clearTimeout(this.filterTimer)
					this.filterTimer = setTimeout(() => {
						if (this.filterstr.trim().length>0)
							this.filterRslt = this.rows.filter((val, idx, arr)=>{
								return Object.keys(val).reduce((acum,current,idx)=>{
									val[current] && (acum = acum + '_' + val[current].toString());
									return acum;
								}, "").toUpperCase().indexOf(this.filterstr.toUpperCase()) > -1
							})
						else {this.filterRslt = this.rows}
						setTimeout(() => {
							this.loadingIndicator = false;
						}, 200);
					}, 700);
				}

				reload(e){
					e && e.preventDefault();
					this.loadingIndicator = true;
					if (e  && e.altKey) {
						this.communicator.get${datos.tskeyCapitalize}(null).subscribe(x => {
							x && x.hasOwnProperty('type') && x.type == 'ok' &&  (this.rows = x.datos);
							this.updateFilter(null);
						});
					}else
						this.ram.getDatos("${tskey}",1,1);
				}
				ngOnInit() {
				};
				ngOnDestroy() {
					this.destroy$.next(true);
					this.destroy$.unsubscribe();
				};
				${externos.join('\r\n')}

				body
				div(class="content-heading") {{'frm.${tskey}.tit' | translate}}
				.row
					.col-sm-5
						.card.card-default
							.card-header
								span {{"frm.${tskey}.frmtit" | translate}}
								a.text-muted.float-right(tooltip="{{'rot.reload' | translate}}",  (click)= "reload($event)")
									em.icon-reload
								.text-muted.float-right
									| &nbsp; &nbsp;
								a.text-muted.float-right(tooltip="{{'rot.new' | translate}}", (click)= "resetForm($event)")
									em.icon-doc
							.card-body
								form.form-validate.mb-3(role="form")
									${pugResul}
									button.btn.btn-success.mb-xs(role="button", (click) = "saveBtn($event)")
										i.big-check
										| {{'btns.safe' | translate}}

					.col-sm-7
						input.form-control.form-control-rounded(type='text',
							placeholder='{{"rot.filter" | translate}}',
							style='padding:8px;margin:0px auto 10px auto;width:90%;',
							(keyup)='updateFilter($event)',
							[(ngModel)]="filterstr")

						ngx-datatable.material.fullscreen(
							#table='',
							[rows]='filterRslt',
							[columnMode]="'force'",
							[headerHeight]="50",
							[footerHeight]="50",
							[sortType]="'multi'",
							[rowHeight]="40",
							[scrollbarV]="false",
							[scrollbarH]="true",
							[reorderable]="true",
							[swapColumns]="false",
							[limit]="10",
							[loadingIndicator]="loadingIndicator")
							ngx-datatable-column(
								name="Edit",
								[width]='55',
								[sortable]="false",
								[canAutoResize]="false",
								[draggable]="false",
								[resizeable]="false")
								ng-template(let-row="row", ngx-datatable-cell-template="")
									button.btn.btn-sm.btn-outline-info((click)="editBtn($event,row)", tooltip= "{{'btns.edit' | translate}}")
										i.icon.fa.fa-edit
							${datos.table.join('\r\n\t\t\t\t\t\t\t')}


						.form-group
							label {{'${translate+'.'+tskey}txtlabel' | translate}} :
							app-${tskey}text(
								placeholder = "{{'${translate + '.' + tskey}txtph' | translate}}",
								[isSearchable] = "true",
								[value] = "setters.${datos.primarysKeys[0]}",
								[filtro] ='null',
								(onChange) = "${tskey}Change($event)" )
	// *********************************************************************
	// ###### AGREGAR AL communicator SERVICE  ######
	// *********************************************************************

	// TODOS LOS EVENTOS HTTP PARA *** ${tablename.toUpperCase()} ***
	// _________________________________________________________________________
		set${datos.tskeyCapitalize}(body: Object) {
			body = body || {};
			return this.http.post('/backpani/s${tskey}', body).map(this.setterFnOk);
		};
		get${datos.tskeyCapitalize}(body: any) {
			body = (body && body.hasOwnProperty('scope')) ? body : Object.assign(body || {}, { scope: "CIA" });
			return this.http.post('/backpani/g${tskey}', body).map(this.setterFnOk);
		}
		del${datos.tskeyCapitalize}(body: Object) {
			body = body || {};
			return this.http.post('/backpani/d${tskey}', body).map(this.setterFnOk);
		};
	// |\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/



	// *********************************************************************
	// ###### AGREGAR AL ROUTER DE Express  ######
	// *********************************************************************
	// TODAS LAS RUTAS PARA *** ${tablename.toUpperCase()} ***
	// _________________________________________________________________________
		r.post('/d${tskey}', candado, (req, res, next) => {
			process${datos.tskeyCapitalize}("d${datos.tskeyCapitalize}",req, res)
		});
		r.post('/s${tskey}', candado, (req, res, next) => {
			process${datos.tskeyCapitalize}("s${datos.tskeyCapitalize}",req, res)
		});
		let process${datos.tskeyCapitalize} = (keysql,req, res) => {
			if	(_SQL.hasOwnProperty(keysql)){
				_SQL[keysql](req.body, req.session)
				.then((datos) => {
					try {
						RAM.${tskey}({ match: req.session.user }, 1).then((res) => {
							req.app.io.in('cia_' + req.session.user.cia_nid).emit('dbquery', Object.assign({ origen: '${tskey}' }, res));
						});
					} catch (ex) {
						console.log(ex);
						req.app.io.in('session_' + req.session.id).emit('backendError',{msg:"backend.EX003", err: ex});
					}
					res.send(datos);
				}, (datos) => { run.fail(datos, res, req) })
			}else{
				res.send({type: 'paramsError', msg: "backend.EX001", error: {key: keysql } });
			}
		};
		r.post('/g${tskey}', candado, (req, res, next) => {
			_SQL.g${datos.tskeyCapitalize}(req.body, req.session)
			.then((data) => {
				run.resolvestd(data, res, req)
			})
			.catch((data) => {
				run.fail(data,res,req);
			})
		});
	// |\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/


	// *********************************************************************
	// ###### AGREGAR A LA LIBRERIA SQL  ######
	// *********************************************************************
	// Metodos SQL PARA *** ${tablename.toUpperCase()} ***
	// _________________________________________________________________________
		sql.s${datos.tskeyCapitalize} = (body, session) => {
			body = body || {};
			let deferred = q.defer();

			//⬇⬇⬇⬇⬇⬇⬇Si la Tabla requiere cia_nid la siguiente linea comprueba su existencia ⬇⬇⬇⬇⬇⬇
			${datos.hasCianid ?"body['cia_nid'] = session.user.cia_nid;":''}
			//⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆
			let params = {
				data:body,
				table:'${tablename}',
				key:'${datos.primarysKeys.join(', ')}',
				where: null,
				return: '*' //<-usar * para devolcer todo el row afectado o insertado
			};
			run.upsert('BS',params, 's${datos.tskeyCapitalize}')
			.then(x => {
				deferred.resolve(x)
			}).catch((res) => {
				deferred.reject(res);
			});
			return deferred.promise;
		};
		sql.g${datos.tskeyCapitalize}=(options,session)=>{
			return new Promise((resolve, reject)=>{
				try{
					if (!(options && options.scope)){
						reject({type: 'dataError', msg: "backend.EX004", error : options });
					}
					let strsql = "";
					${datos.hasCianid ? "!options.hasOwnProperty('match') && (options['match'] = session.user.cia_nid);" : ''}
					switch(options.scope){
						case 'CIA':
							strsql = SqlString.format('SELECT ${datos.allFields.join(', ')} FROM ${tablename}  WHERE _bsts = 1 AND cia_nid = ? ORDER BY ${datos.primarysKeys.join(', DESC')}  DESC', [options.match]);
							break;
						case 'CIAALL':
							strsql = SqlString.format('SELECT ${datos.allFields.join(', ')} FROM ${tablename}  WHERE cia_nid = ? ORDER BY ${datos.primarysKeys.join(', DESC')}  DESC', [options.match]);
							break;
						case 'ALL':
							strsql = 'SELECT ${datos.allFields.join(', ')} FROM ${tablename}  ORDER BY ${datos.primarysKeys.join(', DESC')} DESC';
							break;
						default:
							reject({type: 'dataError', msg: "backend.EX001", error : options });
							return;
					}; //==>> Guarda el resultado final del HTML

					run.query('BS',strsql, 'g${datos.tskeyCapitalize}').then(data=>{
						try{
							resolve(data);
						}catch(ex){
							console.log(ex);
						}
					}).catch(err => {
						reject(err);
					});
				}catch(ex){
					console.log(ex)
				}
			});
		};
		sql.d${datos.tskeyCapitalize} = (body, session) => {
			body = body || {};

			let cia_nid = session.cia_nid;
			if (session.user && session.user.usr_nsuper*1 == 1) {
				if (body.cia_nid) {
					cia_nid = body.cia_nid
				}
			}

			let deferred = q.defer();
			let params = {
				table: '${tablename}',
				key: '${datos.primarysKeys.join(', ')}',
				value: body.${datos.primarysKeys.join(', ')},
				reqCia: ${datos.hasCianid},
				cia: cia_nid
			};
			run.delete(params, 'd${datos.tskeyCapitalize}')
				.then(
				x => {
					deferred.resolve(x)
				}
				)
				.catch(
				(res) => {
					deferred.reject(res);
				}
				);
			return deferred.promise;
		};
	// |\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/

	// Metodos RAM_DB *** ${tablename.toUpperCase()} ***
	// _________________________________________________________________________
		ramdata.${tskey} = (qryp, strict) => {
			let deferred = q.defer();
			${datos.hasCianid ? `!repo.hasOwnProperty('${tskey}') && (repo['${tskey}'] = {});

			${datos.hasCianid ? "let cia_nid = qryp.match.cia_nid;" : ''}
			!repo.${tskey}.hasOwnProperty(cia_nid) && (repo.${tskey}[cia_nid] = [] );
			if ((repo.${tskey}[cia_nid].length == 0) || (strict && strict == 1)) {` : `!repo.hasOwnProperty('${tskey}') && (repo['${tskey}'] = []);
			if ((repo.${tskey}.length == 0) || (strict && strict == 1)) {`}
				try {
					_SQL.g${datos.tskeyCapitalize}({
						scope: 'CIA',
						match: ${datos.hasCianid?'cia_nid':0}
					})
						.then((res) => {
							resolvestd(res, qryp, "${tskey}", deferred)
						})
						.catch((res) => {
							console.log("No hay respuesta");
							deferred.reject(res);
						})
				} catch (ex) {
					console.log(ex);
				}
			} else {
				process.nextTick(() => {
					deferred.resolve({ type: "ok", datos: repo.${tskey}${datos.hasCianid ? '[cia_nid]' : ''}, qrtype: 'RAM' });
				});
			}
			return deferred.promise;
		};
	// |\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/|\\-/


	// Para el Component de busqueda Usar comando
	// ng g c shared/components/${tskey}text
	// ng g c routes/*&***&**/${tskey}
	${tskey}Change(e){
		if (e) {
			this.frmdata.${datos.primarysKeys[0]} = e.${datos.primarysKeys[0]};
		}else{
			this.frmdata.${datos.primarysKeys[0]} = null;
		}
	}
	//Esto va en la funcion Edit ⬇⬇⬇
	this.setters.${datos.primarysKeys[0]} = { ${datos.primarysKeys[0]}: rw["${datos.primarysKeys[0]}"]};
	// Setter dede incluir
	//public setters={ ${datos.primarysKeys[0]} : null, }
	//
// &&&&&&&&&&&&&&&&&&&&&&&&********************************&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&********************************&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&********************************&&&&&&&&&&&&&&&&&&
${selectControl}
// &&&&&&&&&&&&&&&&&&&&&&&&********************************&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&********************************&&&&&&&&&&&&&&&&&&
// &&&&&&&&&&&&&&&&&&&&&&&&********************************&&&&&&&&&&&&&&&&&&
	`







		return html;
	}


	module.exports = boots;

