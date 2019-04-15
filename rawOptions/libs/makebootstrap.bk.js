let boots = {};
boots.make = (data,translate, tablename)=>{
	let tskey = translate.split('.')[translate.split('.').length -1 ];
	let datos = {
		hasSetter : false,
		setters : [],
		hasTags :false,
		hasMailValidators : false,
		hasErrorMessages : false,
		hasPhone: false,
		hasCianid:false,
		primarysKeys:[],
		tskeyCapitalize: tskey.charAt(0).toUpperCase() + tskey.slice(1),
		table : [],
		columns : [],
		requireds: [],
		tagsToText: [],
		tagEdit: 	[],
		retursPrimaryskey:[],
		allCampos : [],
	}

	let js = [];
	let traduccion = [];
	let traduccion_ph = [];
	let traduccion_th = [];
	let traduccion_rq = [];
	let frmdata = [];

	let html = `
	`;
	// Elementos HTML
	let elements = [];
	data.forEach(column => {
		let valor;

		datos.hasCianid = datos.hasCianid || column.columna == 'cia_nid';
		datos.allCampos.push(column.columna);
		datos.table.push(`td {{row.${column.columna}}}`);
		datos.columns.push(`{key: '${column.columna}', title: this.translate.instant('${translate}.${column.columna}_th'), orderEnabled: true, searchEnabled: true },`);
		elements.push(`//- ****************************************** -//`);
		elements.push(`//- *********** ${column.columna} ************ -//`);

		if (column.primario == '1') {
			elements.push("//- PrimaryKey Hiden");
			elements.push(`input.form-control(type="hidden", readonly, [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`);
			elements.push("//- PrimaryKey Visible");
			elements.push(".form-group");
			elements.push(`\tlabel {{'${translate}.${column.columna}' | translate}} :`);
			elements.push(`\tinput.form-control(type="number", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", readonly, [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)

			valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? parseInt(column.predeterminado) : 0;

			datos.retursPrimaryskey.push(`x.datos.rows && x.datos.rows[0] && x.datos.rows[0].${column.columna} && (this.frmdata.${column.columna} = x.datos.rows[0].${column.columna});`);
			datos.requireds.push(`!this.fws.validInt(this.frmdata.${column.columna}, 0, null) && ( (paso = false) || this.fws.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)

			datos.primarysKeys.push(column.columna);
		}else{
			elements.push(".form-group");
			elements.push(`\tlabel {{'${translate}.${column.columna}' | translate}} :`);
			switch (column.datatype) {
				case 'int2':
					elements.push(`\tinput.form-control(type="number",min="-32768", max="32767", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)
					datos.requireds.push(`!this.fws.validInt(this.frmdata.${column.columna}, 0, 32767) && ( (paso = false) || this.fws.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)

					valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? parseInt(column.predeterminado) : 0;
					break;
				case 'int4':
					elements.push(`\tinput.form-control(type="number",min="-2147483648", max="2147483647", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)
					datos.requireds.push(`!this.fws.validInt(this.frmdata.${column.columna}, 0, 2147483647) && ( (paso = false) || this.fws.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
					valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? parseInt(column.predeterminado) : 0;
					break;
				case 'int8':
					elements.push(`\tinput.form-control(type="number",min="-9223372036854775808", max="9223372036854775807", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)
					datos.requireds.push(`!this.fws.validInt(this.frmdata.${column.columna}, 0, 9223372036854775807) && ( (paso = false) || this.fws.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
					valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? parseInt(column.predeterminado) : 0;
					break;
				case 'varchar':
					elements.push(`\tinput.form-control(type="text", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]="frmdata.${column.columna}", name="${column.columna}", #${column.columna}="ngModel", required, minlength="2", maxlength="${column.maxlength}")`)
					datos.requireds.push(`!this.fws.validString(this.frmdata.${column.columna}, 2, ${column.maxlength}) && ( (paso = false) || this.fws.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
					if (column.columna.indexOf('mail')>-1) {
						datos.setters.push(`\t${column.columna} : [] `); //=> agregar el setter

						elements.push("\t//- Tags Options for emails");
						elements.push("\tbr")
						elements.push(`\ttag-input([(ngModel)]="setters.${column.columna}", theme='minimal', secondaryPlaceholder="{{'${translate}.${column.columna}_ph' | translate}}" , placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [validators]="fws.mailValidator", [errorMessages]="errorMessages", name="${column.columna}", [maxItems]="6")`)
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
						elements.push(`\ttag-input([(ngModel)]="setters.${column.columna}", theme='minimal', secondaryPlaceholder="{{'${translate}.${column.columna}_ph' | translate}}" , placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [validators]="fws.phoneValidator", [errorMessages]="errorMessages", name="${column.columna}", [maxItems]="6")`)
						datos.hasTags = true;
						datos.hasSetter = true;
						datos.hasErrorMessages = true;
						datos.hasPhone = true;

					}
					if (column.columna.indexOf('mail') > -1 || column.columna.indexOf('phone') > -1 || column.columna.indexOf('telf') > -1) {
						datos.table.pop();
						datos.table.push(`td {{row.${column.columna}.split('_&&_').join('; ')}}`);

						datos.requireds.push(`this.frmdata.${column.columna}.split('_&&_').length < 1  && ( (paso = false) || this.fws.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
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
						datos.requireds.push(`!this.fws.validInt(this.frmdata.${column.columna}, 0, null) && ( (paso = false) || this.fws.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
					}else{
						for (let index = 0; index < column.nsize; index++) {
							if (index == (column.nsize - column.scala)) {
								number.push('.')
							};
							number.push('9');
						};
						datos.requireds.push(`!this.fws.validNumber(this.frmdata.${column.columna}, 0, null) && ( (paso = false) || this.fws.toast('warning', 'BigTrack', this.translate.instant('frm.${tskey}.${column.columna}_rq')) )`)
					}
					let format = number.join('');
					elements.push(`\tinput.form-control(type="number",min="-${format}", max="${format}", step="any", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)
					elements.push(`\tinput.form-control(type="number",min="0.00", max="${format}", step="any", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)

					if (column.nsize == 1 && column.scala ==0) {
						elements.push("\t//- CheckBoxsOptions");
						elements.push("\tbr")
						elements.push("\tlabel.radio-inline.c-radio")
						elements.push(`\t\tinput#inlineradio1(type="radio", name="${column.columna}", value="0", [(ngModel)]="frmdata.${column.columna}", checked="checked")`)
						elements.push(`\t\tspan.fa.fa-circle`)
						elements.push(`\t\t| {{'${translate}.${column.columna}0' | translate}}`)
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
						traduccion.push(`\t${column.columna}0 : "NO"`)
						traduccion.push(`\t${column.columna}1 : "SI"`)
						valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? "'" + parseFloat(column.predeterminado) + "'"  : "'0'";
					}else{
						valor = (column.predeterminado && (!isNaN(column.predeterminado))) ? parseFloat(column.predeterminado) : 0.00;
					}
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


		elements.push(`//- ******************************************`);
		elements.push("\r\n\r\n")
	});
	traduccion_ph.push(`\t${tskey}txtlabel : "${tskey}txtlabel" `)
	traduccion_ph.push(`\t${tskey}txtph : "${tskey}txtph" `)
	traduccion_ph.push(`\ttit : "Titulo ${datos.tskeyCapitalize}" `)
	let pugResul = elements.join('\r\n\t\t\t\t\t\t\t')



	js.push(`let  ${tskey} : {`);
	js.push(`\t\t\t` + traduccion.join(',\r\n\t\t\t') + ',\r\n\t\t\t' + traduccion_ph.join(',\r\n\t\t\t') + ',\r\n\t\t\t' + traduccion_th.join(',\r\n\t\t\t') + ',\r\n\t\t\t' + traduccion_rq.join(',\r\n\t\t\t') );
	js.push('\t\t\t},');

	js.push('\t\t\tpublic frmdata = {');
	js.push('\t\t\t' + frmdata.join(',\r\n\t\t\t'));
	js.push('\t\t\t};');

	if (datos.hasSetter) {
		js.push('\t\t\tpublic setters = {');
		js.push('\t\t\t' + datos.setters.join(',\r\n\t\t\t'));
		js.push('\t\t\t};');
	}

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
			import { RammemoryService } from '@shared/services/rammemory.service';
			import { Subject } from 'rxjs/Subject';
			import { SettingsService } from '@shared/services/settings.service';
			import { FrameworkService } from '@shared/services/framework.service';

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
								text: rw.textField&&&&,
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
				constructor(public fws: FrameworkService, public ram: RammemoryService, private setting :SettingsService) {}
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
								text: el["textField&&&&"]}
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
			import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
			import { TranslateService } from '@ngx-translate/core';

			import { FrameworkService } from "@shared/services/framework.service";
			import { CrudService } from "@shared/services/crud.service";
			import { RammemoryService } from "@shared/services/rammemory.service";
			import { SettingsService } from "@shared/services/settings.service";

			import { Subject } from 'rxjs/Subject';
			import { BehaviorSubject } from 'rxjs/BehaviorSubject';
			import Swal from 'sweetalert2'
			declare let jQuery: any;


			// export class [Tu nombre de componenr] implements OnInit, OnDestroy {
			private destroy$: Subject<boolean> = new Subject<boolean>();

			${js.join('\r\n')}
			public ${tskey}_rows = [];
			public ${tskey}_columns = [
				{key: 'Opc', title: this.translate.instant('rotulos.opc'), orderEnabled: false, searchEnabled: false },
				${datos.columns.join('\r\n\t\t\t\t')}
			];
			public isSuper = false; // =>> Si la tabla requiere identificacion por Compañias
			public tableconf;
			constructor(
				public fws: FrameworkService, private translate: TranslateService,
				public ram: RammemoryService, public crud: CrudService,
				public settings: SettingsService){
				this.tableconf = FrameworkService.table_config;
				this.tableconf.detailsTemplate = false;

				// Si la tabla requiere identificacion por Compañias
				${datos.hasCianid ?`this.settings.GlobalSettings.takeUntil(this.destroy$).subscribe(x=>{
					try{
						if (x.hasOwnProperty('user') && x['user'].hasOwnProperty('usr_nsuper')) {
							if (x['user']['usr_nsuper']*1 == 1) {
								this.isSuper = true;
								this.frmdata.cia_nid = 0;
							}else{
								this.isSuper = false;
								this.frmdata.cia_nid = x['user']['cia_nid'];
							}
						}
					}catch(ex){
						this.frmdata.cia_nid = 0;
					}
				});`:''}
			}

			editBtn(e,rw){
				e && e.preventDefault();

				this.resetForm(null);
				for (let key in rw) {
					if (this.frmdata.hasOwnProperty(key)) {
						this.frmdata[key] = rw[key];
					}
				};

				// Sugerencia de edicion pata los tags
				${datos.tagEdit.join('\r\n\t\t\t\t')}
			};
			viewBtn(e, rw) {
				e && e.preventDefault();
			};
			delBtn(e, rw) {
				e && e.preventDefault();
				// if (rw.ESTADO  !=  0) {
				// 	Swal(
				// 		'Ops',
				// 		this.translate.instant('ALGUN ERROR POR RESTRICCION DE BORRADO'),
				// 		'warning'
				// 	)
				// 	return;
				// }
				Swal({
					title: this.translate.instant('rotulos.swal.deltit'),
					text: this.translate.instant('rotulos.swal.delquest'),
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: this.translate.instant('rotulos.swal.yesdel'),
					cancelButtonText: 'No.'
				}).then((result) => {
					if (result.value) {
						this.crud.del${datos.tskeyCapitalize}(rw).subscribe(x => {
							// console.log(x);
							if (x.hasOwnProperty('type') && x['type'] == 'ok') {
								Swal(
									'Deleted',
									'Ok!',
									'success'
								)
							}else{
								Swal(
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
					this.crud.set${datos.tskeyCapitalize}(this.frmdata).subscribe(x => {
						${datos.retursPrimaryskey.join('\r\n\t\t\t\t\t\t')}
					});
				}
			};
			resetForm(e) {
				e && e.preventDefault();
			};

			reFresh${datos.tskeyCapitalize}(e){
				e && e.preventDefault();
				this.ram.getDatos("${tskey}", 1, 1).take(1).subscribe(x => {
					console.log("Actualizacion Completada");
				});
			};
			ngOnInit() {
				this.ram.getDatos("${tskey}").takeUntil(this.destroy$).subscribe(data => {
					this.${tskey}_rows = data;
				});
			};
			ngOnDestroy() {
				this.destroy$.next(true);
				this.destroy$.unsubscribe();
			};

			// *********************************************************************
			// ###### AGREGAR AL CRUD SERVICE  ######
			// *********************************************************************

			// TODOS LOS EVENTOS HTTP PARA *** ${tablename.toUpperCase()} ***
			// _________________________________________________________________________
				set${datos.tskeyCapitalize}(body: Object) {
					body = body || {};
					return this.http.post('/pmain/s${tskey}', body).map(this.setterFnOk);
				};
				get${datos.tskeyCapitalize}(body: any) {
					body = body || Object.assign(body, {
						scope: "CIA"
					});
					return this.http.post('/pmain/g${tskey}', body).map(this.setterFnOk);
				}
				del${datos.tskeyCapitalize}(body: Object) {
					body = body || {};
					return this.http.post('/pmain/d${tskey}', body).map(this.setterFnOk);
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
								RAM.${tskey}({ match: req.session }, 1).then((res) => {
									req.app.io.in('cia_' + req.session.cia_nid).emit('dbquery', Object.assign({ origen: '${tskey}' }, res));
								});
							} catch (ex) {
								console.log(ex);
								req.app.io.in('session_' + req.session.id).emit('backendError',{msg:"backend.EX001", err: ex});
							}
							res.send(datos);
						}, (datos) => { run.fail(datos, res, req) })
					}else{
						res.send({type: 'paramsError', msg: "backend.EX002", error: {key: keysql } });
					}
				};
				r.post('/g${tskey}', candado, (req, res, next) => {
					_SQL.g${datos.tskeyCapitalize}(req.body)
					.then((data) => {
						run.resolvestd(data, res, req)
					})
					.fail((data) => {
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
					${datos.hasCianid ?`if (session.user.usr_nsuper *1  == 1) {
						if (!body.hasOwnProperty('cia_nid') || isNaN(body['cia_nid']) || body['cia_nid'] * 1 <= 0) body['cia_nid'] = session.cia_nid;
					}else{
						body['cia_nid'] = session.cia_nid
					}`:''}
					//⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆
					let params = {
						data:body,
						table:'${tablename}',
						key:'${datos.primarysKeys.join(', ')}',
						where: null,
						return: '*' //<-usar * para devolcer todo el row afectado o insertado
					};
					run.upsert(params, 's${datos.tskeyCapitalize}')
					.then(x => {
						deferred.resolve(x)
					}).fail((res) => {
						deferred.reject(res);
					});
					return deferred.promise;
				};
				sql.g${datos.tskeyCapitalize}=(options)=>{
					let deferred = q.defer();
					try{
						if (!(options && options.scope)){
							deferred.reject({type: 'dataError', msg: "backend.EX004", error : options });
						}
						let strsql = "";
						switch(options.scope){
							case 'CIA':
								strsql = format('SELECT ${datos.allCampos.join(', ')} FROM ${tablename}  WHERE cia_nid = %s ORDER BY ${datos.primarysKeys.join(', DESC')}  DESC', options.match);
								break;
							case 'ALL':
								strsql = 'SELECT ${datos.allCampos.join(', ')} FROM ${tablename}  ORDER BY ${datos.primarysKeys.join(', DESC')} DESC';
								break;
							default:
								process.nextTick(()=>{
									deferred.reject({type: 'dataError', msg: "backend.EX005", error : options });
								});
								return deferred.promise;
						};
						run.stdqry(strsql, 'g${datos.tskeyCapitalize}').then(data=>{
							try{
								deferred.resolve(data);
							}catch(ex){
								console.log(ex);
							}
						}).fail(err => {
							deferred.reject(err)
						});
					}catch(ex){
						console.log(ex)
					}
					return deferred.promise;

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
						.fail(
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
					let cia_nid = qryp.match.cia_nid;
					if (qryp.match.usr_nsuper*1 == 1) {
						if (qryp.hasOwnProperty('params') && qryp.params.hasOwnProperty('cia_nid')) {
							cia_nid = qryp.params.cia_nid;
						}
					}
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
								.fail((res) => {
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

${selectControl}

	body
		h1(class="page-title") {{'frm.${tskey}.tit' | translate}}
		.row
			.col-sm-4
				section.widget(widget)
					header
						h5 Form
						.widget-controls
							a(title='Reset', (click)="resetForm($event);")
								i.big-refresh
							a(data-widgster='expand', title='Expand', href='#')
								i.glyphicon.glyphicon-chevron-up
							a(data-widgster='collapse', title='Collapse', href='#')
								i.glyphicon.glyphicon-chevron-down
					.widget-body
						form(role="form")
							${pugResul}
							button.btn.btn-success.mb-xs(role="button", (click) = "saveBtn($event)")
								i.big-check
								| {{'btns.safe' | translate}}

		section.widget(widget)
			header
				h5 Data
				.widget-controls
					a(title='Reset', (click)="reFresh${datos.tskeyCapitalize}($event);")
						i.big-refresh
					a(data-widgster="expand", title="Expand", href="#")
						i.glyphicon.glyphicon-chevron-up
					a(data-widgster="collapse",title="Collapse",href="#")
						i.glyphicon.glyphicon-chevron-down
			.widget-body
				ngx-table([configuration]="tableconf", [data]="${tskey}_rows", [columns]="${tskey}_columns")
					ng-template(let-row="")
						td
							.btn-group.btn-group(role="group" aria-label="...")
								button.btn.btn-success(type="button",(click)="editBtn($event,row)", tooltip= "{{'btns.edit' | translate}}")
									i.big-pencil
								button.btn.btn-info(type="button",(click)="viewBtn($event,row)", tooltip= "{{'btns.view' | translate}}")
									i.big-eye
								button.btn.btn-danger(type="button",(click)="delBtn($event,row)", tooltip= "{{'btns.delte' | translate}}")
									i.big-times
						${datos.table.join('\r\n\t\t\t\t\t\t')}


			.form-group
				label {{'${translate+'.'+tskey}txtlabel' | translate}} :
				app-${tskey}text(
					placeholder = "{{'${translate + '.' + tskey}txtph' | translate}}",
					[isSearchable] = "true",
					[value] = "setters.${datos.primarysKeys[0]}",
					[filtro] ='null',
					(onChange) = "${tskey}Change($event)" )
`







	return html;
}


module.exports = boots;

