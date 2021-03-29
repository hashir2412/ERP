import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemRowViewModel } from 'src/app/inventory/inventory.viewModel';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewItemsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { items: ItemRowViewModel[] }) { }

  ngOnInit(): void {
  }

  onCancel(){
    this.dialogRef.close();
  }
}
