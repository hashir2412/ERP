import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryService } from '../inventory.service';
import { ItemRowViewModel } from '../inventory.viewModel';
import { InputType, InventoryInputFields } from './inventory-input-field';

@Component({
  selector: 'app-add-edit-inventory-dialog',
  templateUrl: './add-edit-inventory-dialog.component.html',
  styleUrls: ['./add-edit-inventory-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditInventoryDialogComponent implements OnInit {
  inputFields = InventoryInputFields;
  inputType = InputType;
  showDuplicateErrorMessage = false;
  newItem: ItemRowViewModel = new ItemRowViewModel();

  constructor(
    public dialogRef: MatDialogRef<AddEditInventoryDialogComponent>,
    private inventoryService: InventoryService,
    @Inject(MAT_DIALOG_DATA) public data: { items: ItemRowViewModel[], title: string }) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(form :NgForm) {
    if(form.valid){
      const duplicateItem = this.data.items.find(item =>
        item.name === this.newItem.name && item.quantityName === this.newItem.quantityName && item.quantityValue === this.newItem.quantityValue
      );
      if(duplicateItem){
        this.showDuplicateErrorMessage = true;
      } else{
        this.dialogRef.close(this.newItem);
      }
    }
    
  }

  ngOnInit(): void {
  }

  onCalculateTotalPrice() {
    this.newItem.priceWithTax = this.newItem.priceWithoutTax + (this.newItem.gst / 100 * this.newItem.priceWithoutTax);
    this.newItem.sellingPriceWithTax = this.newItem.sellingPriceWithoutTax + (this.newItem.gst / 100 * this.newItem.sellingPriceWithoutTax);
  }

}
