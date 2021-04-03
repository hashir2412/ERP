import { Injectable } from "@angular/core";
import { Message } from "primeng-lts";
import { ResponseModel } from "../response.model";
import { AddPurchaseModel } from "../add-purchase-dialog/add-purchase.viewModel";
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from "@angular/common";
import { BillType } from "../add-purchase-dialog/add-purchase.enum";
import { numToWords } from 'num-to-words';
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

    printInvoice(invoiceNumber: number, data: AddPurchaseModel, billType: BillType) {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Invoice');
        worksheet.addRow([null, 'Tax Invoice']).font = { bold: true };
        worksheet.addRow(['Supplier', 'Invoice No.', 'Date', null, null, 'Bank Details']).font = { bold: true };
        worksheet.addRow(['Popular Enterprises \r\nKhan Building \r\nTandel Street (North) \r\nMumbai 400009 \r\nGSTIN/UIN: 27CFJPK8259K2ZP \r\nState: Maharashtra Code: 27', invoiceNumber, this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
            null])
            .alignment = { wrapText: true };
        worksheet.getColumn('A').width = 30;
        worksheet.getColumn('A');
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
            dataString.push(`${billType === BillType.Purchase ? item.priceWithoutTax : item.sellingPriceWithoutTax}`);
            dataString.push(`pc`);
            dataString.push(`${billType === BillType.Purchase ? item.requestedQuantity * item.priceWithoutTax : item.requestedQuantity * item.sellingPriceWithoutTax}`);
            worksheet.addRow(dataString);
            worksheet.addRow([`Output CGST ${item.gst / 2} %`, null, null, null, null, null, billType === BillType.Purchase ? (item.priceWithTax - item.priceWithoutTax) : item.sellingPriceWithTax - item.sellingPriceWithoutTax]);
            worksheet.addRow([`Output SGST ${item.gst / 2} %`, null, null, null, null, null, billType === BillType.Purchase ? (item.priceWithTax - item.priceWithoutTax) : item.sellingPriceWithTax - item.sellingPriceWithoutTax]);
        });
        const totalInWords = numToWords(Math.round(data.total));
        worksheet.addRow(['Sub Total', null, null, null, null, null, data.subTotal]);
        worksheet.addRow(['Total', null, null, null, null, null, data.total]);
        worksheet.addRow([`INR ${totalInWords.toUpperCase()} only`, null, null, null, null, 'RoundUp', Math.round(data.total)]);
        worksheet.addRow(['Bharat Co-Operative \r\n Bank (Mumbai) Ltd \r\n Ac No. 009312100002440\r\nIFSC Code BCBM0000094']).alignment = { wrapText: true };
        worksheet.addRow(['PAN No. CFJPK8259K']);
        worksheet.addRow(['For Popular Enterprises']);
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow(['Authorized Signatory']);
        worksheet.eachRow(row => {
            row.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.alignment = { wrapText: true };
        });
        // Set font, size and style in title row.
        // Blank Row
        worksheet.addRow([]);

        //Add row with current date
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `${invoiceNumber}_${billType === BillType.Purchase ? 'PurchaseInvoice' : 'SaleInvoice'}.xlsx`);
        });

    }
}