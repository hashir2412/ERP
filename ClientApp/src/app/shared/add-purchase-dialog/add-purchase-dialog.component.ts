import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Message } from 'primeng-lts';
import { Subject } from 'rxjs';
import { SelectionItemValue, UnitOfMeasurement } from 'src/app/constants/selection-item';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { ItemRowViewModel } from 'src/app/inventory/inventory.viewModel';
import { ConsumerSupplierRowModel } from 'src/app/shared/consumer-supplier-row.viewModel';
import { MessageSeverity } from '../message/message.enum';
import { CommonService } from '../services/common.service';
import { BillType } from './add-purchase.enum';
import { AddPurchaseModel } from './add-purchase.viewModel';
import * as deepClone from 'lodash';

@Component({
  selector: 'app-add-purchase-dialog',
  templateUrl: './add-purchase-dialog.component.html',
  styleUrls: ['./add-purchase-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPurchaseDialogComponent implements OnInit {
  addPurchaseModel: AddPurchaseModel = new AddPurchaseModel();
  items: ItemRowViewModel[];
  subTotal = 0;
  total = 0;
  gst = 0;
  billType = BillType;
  unitOfMeasurements: SelectionItemValue[] = UnitOfMeasurement;
  messages$: Subject<Message> = new Subject<Message>();
  constructor(
    public dialogRef: MatDialogRef<AddPurchaseDialogComponent>,
    private inventoryService: InventoryService, private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: {
      suppliers: ConsumerSupplierRowModel[], sectionTitle: BillType, selectTitle: string,
      orderIds: string[]
    }) {
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.inventoryService.getItems(true).subscribe(res => {
      this.items = res.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
    });
  }


  onAddItems() {
    this.addPurchaseModel.items.push(new ItemRowViewModel());
  }

  removeItem(index: number) {
    this.addPurchaseModel.items.splice(index);
    this.calculateTotalAndSubTotal();
  }

  onSubmit(form: NgForm) {
    form.control.markAsDirty();
    if (form.valid) {
      if (!this.data.orderIds.find(res => res.toLowerCase() === this.addPurchaseModel.orderId.toLowerCase())) {
        this.addPurchaseModel.subTotal = this.subTotal;
        this.addPurchaseModel.total = this.total;
        this.addPurchaseModel.items = this.addPurchaseModel.items.filter(
          (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
        );
        if (this.data.sectionTitle === BillType.Sale) {
          if (this.validationForSalePassed()) {
            this.dialogRef.close(this.addPurchaseModel);
          }
        } else {
          this.dialogRef.close(this.addPurchaseModel);
        }
      } else {
        const message = this.commonService.getMessage(`Bill Number ${this.addPurchaseModel.orderId} already exists, please select a unique Bill Number to proceed`, 'Error', MessageSeverity.Error);
        this.messages$.next(message);
      }
      
    }
  }

  validationForSalePassed(): boolean {
    let validationPassed = true;
    for (let item of this.addPurchaseModel.items) {
      if (item.quantity < item.requestedQuantity) {
        const message = this.commonService.getMessage(`Requested quantity is greater than available quantity for item ${item.name} ${item.quantityValue}
         ${item.quantityName}`, 'Error', MessageSeverity.Error);
        this.messages$.next(message);
        validationPassed = false;
        break;
      }
    }
    return validationPassed;
  }

  calculateTotalAndSubTotal() {
    this.total = 0;
    this.subTotal = 0;
    this.gst = 0;
    this.addPurchaseModel.items.forEach(item => {
      if (this.data.sectionTitle === BillType.Purchase) {
        item.subTotal = item.priceWithoutTax * item.requestedQuantity;
        item.total = item.priceWithTax * item.requestedQuantity;
        this.subTotal = this.subTotal + (item.priceWithoutTax * item.requestedQuantity);
        this.total = this.total + (item.priceWithTax * item.requestedQuantity);
      }
      else {
        item.subTotal = item.sellingPriceWithoutTax * item.requestedQuantity;
        item.sellingPriceWithTax = item.sellingPriceWithoutTax + (item.gst / 100 * item.sellingPriceWithoutTax);
        item.total = item.sellingPriceWithTax * item.requestedQuantity;
        this.subTotal = this.subTotal + item.subTotal;
        this.total = this.total + item.total;
        // item.sellingPriceSubTotal = item.sellingPriceWithoutTax * item.requestedQuantity;
        // item.sellingPriceWithTax = (item.sellingPriceWithoutTax + (item.gst / 100 * item.sellingPriceWithoutTax)) * item.requestedQuantity;
        // this.subTotal = this.subTotal + item.sellingPriceSubTotal;
        // this.total = this.total + item.sellingPriceWithTax;
      }

      this.gst = this.total - this.subTotal;
    });
  }
}
