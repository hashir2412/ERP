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
    @Inject(MAT_DIALOG_DATA) public data: { suppliers: ConsumerSupplierRowModel[], sectionTitle: BillType, selectTitle: string }) {
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.inventoryService.getItems(true).subscribe(res => {
      this.items = res;
    });
  }


  onAddItems() {
    this.addPurchaseModel.items.push(new ItemRowViewModel());
  }

  removeItem(index: number) {
    this.addPurchaseModel.items.splice(index);
  }

  onSubmit(form: NgForm) {
    form.control.markAsDirty();
    if (form.valid) {
      this.addPurchaseModel.subTotal = this.subTotal;
      this.addPurchaseModel.total = this.total;
      if (this.data.sectionTitle === BillType.Sale) {
        if (this.validationForSalePassed()) {
          this.dialogRef.close(this.addPurchaseModel);
        }
      } else {
        this.dialogRef.close(this.addPurchaseModel);
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
        item.sellingPriceSubTotal = item.sellingPriceWithoutTax * item.requestedQuantity;
        item.sellingPriceTotal = item.sellingPriceWithTax * item.requestedQuantity;
        this.subTotal = this.subTotal + (item.sellingPriceWithoutTax * item.requestedQuantity);
        this.total = this.total + (item.sellingPriceWithTax * item.requestedQuantity);
      }

      this.gst = this.total - this.subTotal;
    });
  }

}
