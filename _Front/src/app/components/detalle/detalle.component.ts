import { Component, OnInit } from '@angular/core';
import { tableI } from "../../models/models";


@Component({
    selector: 'app-detalle',
    templateUrl: './detalle.component.html',
    styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
    public _tableDetalle: tableI;

    constructor() { 
        this._tableDetalle = {
			columns: [
				{ key: 'Edit', title: "PUG" },
				{ key: 'fl_nid', title: "TABLE" },
				{ key: 'fl_vnombre', title: "CAMPO" },
                { key: 'fl_vdescripcion', title: "TDATO" },
                { key: 'fl_vdescripcion', title: "LONGITUD" },
				{ key: 'fl_vdescripcion', title: "COMENTARIO" },
                { key: 'fl_vdescripcion', title: "TRADUCCION" },
				{ key: 'fl_vdescripcion', title: "DEF. VALUE" },
			],
			config: {
                searchEnabled: false,
                headerEnabled: true,
                orderEnabled: true,
                orderEventOnly: false,
                globalSearchEnabled: true,
                paginationEnabled: true,
                exportEnabled: false,
                clickEvent: false,
                selectRow: false,
                selectCol: false,
                selectCell: false,
                rows: 10,
                additionalActions: false,
                serverPagination: false,
                isLoading: false,
                detailsTemplate: false,
                groupRows: false,
                paginationRangeEnabled: true,
                collapseAllRows: false,
                checkboxes: false,
                resizeColumn: true,
                fixedColumnWidth: false,
                horizontalScroll: false,
                draggable: false,
                logger: false,
                showDetailsArrow: false,
                showContextMenu: false,
                persistState: false,
                tableLayout: {
                  style: 'normal', // or big or tiny
                  theme: 'normal', // or dark
                  borderless: true,
                  hover: true,
                  striped: false,
                }
            },
			data: []
		};
    }

    ngOnInit() {
    }

}
