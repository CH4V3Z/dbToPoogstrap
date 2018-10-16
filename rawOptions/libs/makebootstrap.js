let boots = {};
let templates = {
	numeric: ``,
	boolean:``
}

let frmdata = {

}

boots.make = (data,translate)=>{
	let html = `

	`;
	let elements = [];
	data.forEach(column => {
		console.log("Registro=> \n\r", column);
		elements.push(`//- ******************************************`);
		elements.push(`//- *********** ${column.columna} ************`);

		if (column.primario == '1') {
			elements.push("//- PrimaryKey Hiden");
			elements.push(`input.form-control(type="hidden", readonly, [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`);
			elements.push("//- PrimaryKey Visible");
			elements.push(".form-group");
			elements.push(`\tlabel {{'${translate}.${column.columna}' | translate}} :`);
			elements.push(`\tinput.form-control(type="number", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", readonly, [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)
			frmdata[column.columna] = (column.predeterminado && parseInt(column.predeterminado) != NaN) ? parseInt(column.predeterminado) : 0;
		}else{
			elements.push(".form-group");
			elements.push(`\tlabel {{'${translate}.${column.columna}' | translate}} :`);
			switch (column.datatype) {
				case 'int2':
					elements.push(`\tinput.form-control(type="number",min="-32768", max="32767", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)
					frmdata[column.columna] = (column.predeterminado && parseInt(column.predeterminado) != NaN) ? parseInt(column.predeterminado) : 0;
					if (column.maxlength == 0) {
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
					}
					break;
				case 'int4':
					elements.push(`\tinput.form-control(type="number",min="-2147483648", max="2147483647", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)
					frmdata[column.columna] = (column.predeterminado && parseInt(column.predeterminado) != NaN) ? parseInt(column.predeterminado) : 0;
					break;
				case 'int8':
					elements.push(`\tinput.form-control(type="number",min="-9223372036854775808", max="9223372036854775807", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]= "frmdata.${column.columna}", name="${column.columna}")`)
					frmdata[column.columna] = (column.predeterminado && parseInt(column.predeterminado) != NaN) ? parseInt(column.predeterminado) : 0;
					break;
				case 'varchar':
					elements.push(`\tinput.form-control(type="text", placeholder="{{'${translate}.${column.columna}_ph' | translate}}", [(ngModel)]="frmdata.${column.columna}", name="${column.columna}", #${column.columna}="ngModel", required, minlength="2", maxlength="${column.maxlength}")`)
					frmdata[column.columna] = column.predeterminado ?column.predeterminado : '';
					break;
				case 'numeric':
					let number = [];
					for (let index = 0; index < column.nsize; index++) {
						if (index == (column.nsize - column.scala) - 1) {
							number.push('.')
						}
						number.push('9');
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
					}

					frmdata[column.columna] = (column.predeterminado && parseFloat(column.predeterminado) != NaN)? parseFloat(column.predeterminado) : 0.00;
					break;
				default:
					break;
			}
		}
		elements.push(`//- ******************************************`);
		elements.push("\r\n\r\n")
	});
	let pugResul = elements.join('\r\n\t\t')
	let jsresut = JSON.stringify(frmdata,null , 2);
	html = `
doctype html
html
	head
		script(type='text/javascript')
			let frmdata = ${jsresut};
	body
		${pugResul}
`

	return html;
}


module.exports = boots;

