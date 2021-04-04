import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemRowViewModel } from 'src/app/inventory/inventory.viewModel';
import { BillType } from 'src/app/shared/add-purchase-dialog/add-purchase.enum';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewItemsComponent implements OnInit {

  billTypeRefrence = BillType;
  constructor(public dialogRef: MatDialogRef<ViewItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { items: ItemRowViewModel[], billType: BillType }) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }
}
