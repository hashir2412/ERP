import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent, RowDataChangedEvent } from 'ag-grid-community';
import { Message } from 'primeng-lts';
import { BehaviorSubject, Subject } from 'rxjs';
import { MessageSeverity } from '../shared/message/message.enum';
import { CommonService } from '../shared/services/common.service';
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
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  messages$: Subject<Message> = new Subject<Message>();

  constructor(private inventoryService: InventoryService, private dialog: MatDialog, private commonService: CommonService) { }
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
    },
    {
      headerName: 'Price Without Tax',
      field: 'priceWithoutTax',
      sortable: true, filter: true
    }, {
      headerName: 'GST(%)',
      field: 'gst',
      sortable: true, filter: true
    },
    {
      headerName: 'Price With Tax',
      field: 'priceWithTax',
      sortable: true, filter: true
    },
    {
      headerName: 'Selling Price Without Tax',
      field: 'sellingPriceWithoutTax',
      sortable: true, filter: true
    }, {
      headerName: 'Selling Price With Tax',
      field: 'sellingPriceWithTax',
      sortable: true, filter: true
    },],
    onGridReady: (event: GridReadyEvent) => {
      this.gridApi = event.api;
    },
    onRowDataChanged: (e: RowDataChangedEvent) => {
      e.api.hideOverlay();
    }
  }
  ngOnInit(): void {
    this.getItems(false);
  }

  getItems(refresh: boolean) {
    this.gridApi && this.gridApi.showLoadingOverlay();
    this.inventoryService.getItems(refresh).subscribe(res => {
      this.rowData$.next(res);
    })
  }

  onAddNewItem() {
    const dialogRef = this.dialog.open(AddEditInventoryDialogComponent, { data: { items: this.rowData$.value, title: 'Add New Item' } });

    dialogRef.afterClosed().subscribe((result: ItemRowViewModel) => {
      if (result) {
        this.loading$.next(true);
        this.inventoryService.addItem(result).subscribe(res => {
          this.loading$.next(false);
          this.getItems(true);
        }, err => {
          this.loading$.next(false);
          const message = this.commonService.getMessage(err.message, 'Error', MessageSeverity.Error);
          this.messages$.next(message);
        });
      }
    });
  }

  onRefresh() {
    this.getItems(true);
  }
}
