import { Injectable } from "@angular/core";
import { Message } from "primeng-lts";
import { ResponseModel } from "../response.model";
import jsPDF from 'jspdf'
import autoTable, { CellDef, ColumnInput, RowInput } from 'jspdf-autotable'
import { AddPurchaseModel } from "../add-purchase-dialog/add-purchase.viewModel";

@Injectable()
export class CommonService {
    isResponseValid<T>(response: ResponseModel<T>): boolean {
        return response.errorCode === 0;
    }

    getMessage(detail: string, summary: string, severity: string): Message {
        const message: Message = { detail: detail, severity: severity, summary: summary };
        return message;
    }

    printInvoice(invoiceNumber: number, data: AddPurchaseModel) {

        const doc = new jsPDF({ format: 'a4' });
        const columns: ColumnInput[] = [
            {
                header: 'No.',
                dataKey: 'number'
            },
            {
                header: 'Name',
                dataKey: 'name'
            },
            {
                header: 'Description',
                dataKey: 'description'
            },
            {
                header: 'Quantity',
                dataKey: 'quantity'
            }, {
                header: 'Quantity Name',
                dataKey: 'quantityName'
            }, {
                header: 'Quanitty Value',
                dataKey: 'quantityValue'
            }, {
                header: 'Price Without Tax',
                dataKey: 'priceWithoutTax'
            }, {
                header: 'Price With Tax',
                dataKey: 'priceWithTax'
            }, {
                header: 'GST',
                dataKey: 'gst'
            },
            {
                header: 'Requested Quantity',
                dataKey: 'requestedQuantity'
            },
            {
                header: 'Sub Total',
                dataKey: 'subTotal'
            },
            {
                header: 'Total',
                dataKey: 'total'
            }]
        // It can parse html:
        // <table id="my-table"><!-- ... --></table>

        // Or use javascript directly:
        const cells: RowInput[] = [];
        const arrayOfArrays = [];
        data.items.forEach((item, index) => {

            // const stringValueArray: string[] = [];
            // keys.forEach(key => {
            //     stringValueArray.push(item[key]);
            // });
            // arrayOfArrays.push(stringValueArray);
            if (!cells[index]) {
                cells[index] = {};
            }
            item.number = index + 1;
            Object.keys(data.items[0]).forEach(key => {
                cells[index][key] = item[key];
            });
        });
        const lMargin = 15; //left margin in mm
        var rMargin = 15; //right margin in mm
        var pdfInMM = 210;
        
        doc.text("Popular Enterprises", 100, 10);
        doc.text("Popular Enterprises", 100, 20);
        doc.text("Popular Enterprises", 100, 30);
        doc.text("Popular Enterprises", 100, 40);
        doc.text(`Invoice No. ${invoiceNumber}`, 10, 10);
        doc.text(data.supplier.name, 10, 20);
        doc.text(data.supplier.gstin, 10, 30);
        const paragraph = doc.splitTextToSize(data.supplier.address, 200, (pdfInMM - lMargin - rMargin));
        const lines = doc.splitTextToSize(paragraph, (pdfInMM - lMargin - rMargin));
        doc.text(lines, 10, 40);

        autoTable(doc, {

            columns: columns,
            body:
                cells
            // ...,
            , headStyles: { fillColor: 'white', textColor: 'black' },
            startY: 50
        });

        doc.text('Popular Enterprises', 10, 250);
        doc.text('Signature', 10, 280);


        doc.save('table.pdf');
    }
}