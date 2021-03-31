import { Injectable } from "@angular/core";
import { Message } from "primeng-lts";
import { ResponseModel } from "../response.model";
import { AddPurchaseModel } from "../add-purchase-dialog/add-purchase.viewModel";
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from "@angular/common";
@Injectable()
export class CommonService {
    /**
     *
     */
    constructor(private datePipe: DatePipe) {

    }
    isResponseValid<T>(response: ResponseModel<T>): boolean {
        return response.errorCode === 0;
    }

    getMessage(detail: string, summary: string, severity: string): Message {
        const message: Message = { detail: detail, severity: severity, summary: summary };
        return message;
    }

    printInvoice(invoiceNumber: number, data: AddPurchaseModel) {
        const title = 'Car Sell Report';
        const header = ["Year", "Month", "Make", "Model", "Quantity", "Pct"]
        const data1 = [
            [2007, 1, "Volkswagen ", "Volkswagen Passat", 1267, 10],
            [2007, 1, "Toyota ", "Toyota Rav4", 819, 6.5],
            [2007, 1, "Toyota ", "Toyota Avensis", 787, 6.2],
            [2007, 1, "Volkswagen ", "Volkswagen Golf", 720, 5.7],
            [2007, 1, "Toyota ", "Toyota Corolla", 691, 5.4],
        ];
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Invoice');
        worksheet.addRow([null, 'Tax Invoice']).font = { bold: true };
        worksheet.addRow(['Supplier', 'Invoice No.', 'Date']).font = { bold: true };
        worksheet.addRow(['Popular Enterprises \r\nKhan Building \r\nTandel Street (North) \r\nMumbai 400009 \r\nGSTIN/UIN: 27CFJPK8259K2ZP \r\nState: Maharashtra Code: 27', invoiceNumber, this.datePipe.transform(new Date(), 'dd/MM/yyyy')])
            .alignment = { wrapText: true };
        worksheet.getColumn('A').width = 30;
        worksheet.getColumn('C').width = 12;
        worksheet.addRow(['Buyer']).font = { bold: true };
        let lines = data.supplier.address.split(',').join('\r\n');
        lines = data.supplier.name + lines
        worksheet.addRow([lines]).alignment = { wrapText: true };
        worksheet.addRow(['Description of goods', 'HSN/SAC', 'GST Rate', 'Quantity(in', 'Rate', 'Per', 'Amount']).font = { bold: true };
        data.items.forEach(item => {
            const dataString: string[] = [];
            dataString.push(`${item.name} ${item.quantityValue} ${item.quantityName}`);
            dataString.push(``);
            dataString.push(`${item.gst}`);
            dataString.push(`${item.requestedQuantity}`);
            dataString.push(`${item.sellingPriceWithoutTax}`);
            dataString.push(`pc`);
            dataString.push(`${item.subTotal}`);
            worksheet.addRow(dataString);
        });
        worksheet.addRow(['Sub Total', null, null, null, null, null, data.subTotal]);
        worksheet.addRow(['Total', null, null, null, null, null, data.total]);
        worksheet.addRow(['Total', null, null, null, null, null, data.total]);
        worksheet.addRow(['Bank Details', null, null, null, 'For Popular Enterprises']);
        worksheet.addRow(['Bharat Co-Operative \r\n Bank (Mumbai) Ltd \r\n Ac No. 009312100002440\r\nIFSC Code BCBM0000094']).alignment = { wrapText: true };
        worksheet.addRow(['PAN No. CFJPK8259K', null, null, null, 'Authorized Signatory']);
        worksheet.eachRow(row => {
            row.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });



        // Set font, size and style in title row.
        // Blank Row
        worksheet.addRow([]);

        //Add row with current date
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'CarData.xlsx');
        });

    }
}
// const columns: ColumnInput[] = [
        //     {
        //         header: 'No.',
        //         dataKey: 'number'
        //     },
        //     {
        //         header: 'Name',
        //         dataKey: 'name'
        //     },
        //     {
        //         header: 'Description',
        //         dataKey: 'description'
        //     },
        //     {
        //         header: 'Quantity',
        //         dataKey: 'quantity'
        //     }, {
        //         header: 'Quantity Name',
        //         dataKey: 'quantityName'
        //     }, {
        //         header: 'Quanitty Value',
        //         dataKey: 'quantityValue'
        //     }, {
        //         header: 'Price Without Tax',
        //         dataKey: 'priceWithoutTax'
        //     }, {
        //         header: 'Price With Tax',
        //         dataKey: 'priceWithTax'
        //     }, {
        //         header: 'GST',
        //         dataKey: 'gst'
        //     },
        //     {
        //         header: 'Requested Quantity',
        //         dataKey: 'requestedQuantity'
        //     },
        //     {
        //         header: 'Sub Total',
        //         dataKey: 'subTotal'
        //     },
        //     {
        //         header: 'Total',
        //         dataKey: 'total'
        //     }];
        // const ws: xlsx.WorkSheet =
        //     xlsx.utils.sheet_add_aoa<data.items>(this.epltable.nativeElement);
        // const wb: xlsx.WorkBook = xlsx.utils.book_new();
        // xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        // xlsx.writeFile(wb, 'epltable.xlsx');
        // const doc = new jsPDF({ format: 'a4' });

        // // It can parse html:
        // // <table id="my-table"><!-- ... --></table>

        // // Or use javascript directly:
        // const cells: RowInput[] = [];
        // const arrayOfArrays = [];
        // data.items.forEach((item, index) => {

        //     // const stringValueArray: string[] = [];
        //     // keys.forEach(key => {
        //     //     stringValueArray.push(item[key]);
        //     // });
        //     // arrayOfArrays.push(stringValueArray);
        //     if (!cells[index]) {
        //         cells[index] = {};
        //     }
        //     item.number = index + 1;
        //     Object.keys(data.items[0]).forEach(key => {
        //         cells[index][key] = item[key];
        //     });
        // });
        // const lMargin = 15; //left margin in mm
        // var rMargin = 15; //right margin in mm
        // var pdfInMM = 210;

        // doc.text("Popular Enterprises", 100, 10);
        // doc.text("Popular Enterprises", 100, 20);
        // doc.text("Popular Enterprises", 100, 30);
        // doc.text("Popular Enterprises", 100, 40);
        // doc.text(`Invoice No. ${invoiceNumber}`, 10, 10);
        // doc.text(data.supplier.name, 10, 20);
        // doc.text(data.supplier.gstin, 10, 30);
        // const paragraph = doc.splitTextToSize(data.supplier.address, 200, (pdfInMM - lMargin - rMargin));
        // const lines = doc.splitTextToSize(paragraph, (pdfInMM - lMargin - rMargin));
        // doc.text(lines, 10, 40);

        // autoTable(doc, {

        //     columns: columns,
        //     body:
        //         cells
        //     // ...,
        //     , headStyles: { fillColor: 'white', textColor: 'black' },
        //     startY: 50
        // });

        // doc.text('Popular Enterprises', 10, 250);
        // doc.text('Signature', 10, 280);


        // doc.save('table.pdf');