import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent, RowDataChangedEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { AddEditInventoryDialogComponent } from './add-edit-inventory-dialog/add-edit-inventory-dialog.component';
import { InventoryService } from './inventory.service';
import { ItemRowViewModel } from './inventory.viewModel';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryComponent implements OnInit {

  rowData$: BehaviorSubject<ItemRowViewModel[]> = new BehaviorSubject<ItemRowViewModel[]>([]);
  gridApi: GridApi;
  constructor(private inventoryService: InventoryService, private dialog: MatDialog) { }
  gridOptions: GridOptions = {
    pagination: true,
    paginationAutoPageSize: true,
    columnDefs: [{
      headerName: 'Name',
      field: 'name',
      sortable: true, filter: true
    }, {
      headerName: 'Description',
      field: 'description',
      sortable: true, filter: true
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true, filter: true
    },
    {
      headerName: 'Unit Of Measurement',
      field: 'quantityName',
      sortable: true, filter: true
    }, {
      headerName: 'Value Of Measurement',
      field: 'quantityValue',
      sortable: true, filter: true
    }, {
      headerName: 'GST(%)',
      field: 'gst',
      sortable: true, filter: true
    }, {
      headerName: 'Price With Tax',
      field: 'priceWithTax',
      sortable: true, filter: true
    }],
    onGridReady : (event:GridReadyEvent) => {
     this.gridApi = event.api;
    },
    onRowDataChanged: (e: RowDataChangedEvent) => {
      e.api.hideOverlay();
    }
  }
  ngOnInit(): void {
    this.getItems(false);
  }

  getItems(refresh: boolean){
    this.gridApi && this.gridApi.showLoadingOverlay();
    this.inventoryService.getItems(refresh).subscribe(res => {
      this.rowData$.next(res);
    })
  }

  onAddNewItem() {
    const dialogRef = this.dialog.open(AddEditInventoryDialogComponent, { data: { items: this.rowData$.value, title: 'Add New Item' } });

    dialogRef.afterClosed().subscribe((result: ItemRowViewModel) => {
      if(result){
        this.inventoryService.addItem(result).subscribe(res => {
          this.getItems(true);
        });
      }
    });
  }

  onRefresh(){
    this.getItems(true);
  }
}
