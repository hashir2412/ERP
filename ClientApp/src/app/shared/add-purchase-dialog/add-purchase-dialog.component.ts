import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionItemValue, UnitOfMeasurement } from 'src/app/constants/selection-item';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { ItemRowViewModel } from 'src/app/inventory/inventory.viewModel';
import { ConsumerSupplierRowModel } from 'src/app/shared/consumer-supplier-row.viewModel';
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
  unitOfMeasurements: SelectionItemValue[] = UnitOfMeasurement;
  constructor(
    public dialogRef: MatDialogRef<AddPurchaseDialogComponent>,
    private inventoryService: InventoryService,
    @Inject(MAT_DIALOG_DATA) public data: { suppliers: ConsumerSupplierRowModel[], selectTitle: string, sectionTitle: string }) {
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.inventoryService.getItems(false).subscribe(res => {
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
      this.dialogRef.close(this.addPurchaseModel);
    }
  }

  calculateTotalAndSubTotal() {
    this.total = 0;
    this.subTotal = 0;
    this.gst = 0;
    this.addPurchaseModel.items.forEach(item => {
      this.subTotal = this.subTotal + (item.priceWithoutTax * item.requestedQuantity);
      this.total = this.total + (item.priceWithTax * item.requestedQuantity);
      this.gst = this.total - this.subTotal;
    });
  }

}
