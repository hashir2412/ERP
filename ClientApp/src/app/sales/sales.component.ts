import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { ItemRowViewModel } from '../inventory/inventory.viewModel';
import { ViewItemsComponent } from '../purchase/view-items/view-items.component';
import { AddPurchaseDialogComponent } from '../shared/add-purchase-dialog/add-purchase-dialog.component';
import { ConsumerSupplierRowModel } from '../shared/consumer-supplier-row.viewModel';
import { CommonService } from '../shared/services/common.service';
import { SalesService } from './sales.service';
import { SalesRowModel } from './sales.viewModel';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SalesService, DatePipe]
})
export class SalesComponent implements OnInit {
  rowData$: BehaviorSubject<SalesRowModel[]> = new BehaviorSubject<SalesRowModel[]>([]);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private salesService: SalesService, private dialog: MatDialog,
    private datePipe: DatePipe, private commonService: CommonService) { }
  private colDef: ColDef = {
    sortable: true,
    floatingFilter: true,
    filter: true
  }
  gridOptions: GridOptions = {
    defaultColDef: this.colDef,
    pagination: true,
    paginationAutoPageSize: true,
    columnDefs: [{
      headerName: 'Supplier Name',
      field: 'consumerName'
    }, {
      headerName: 'Sale Date',
      field: 'saleDate',
      valueFormatter: (params: ValueFormatterParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y, h:mm:ss a');
      }
    }, {
      headerName: 'Total',
      field: 'total'
    },
    {
      headerName: 'Total Without Tax',
      field: 'totalWithoutTax'
    },
    {
      headerName: 'Items',
      filter: false,
      valueGetter: () => {
        return 'View Items';
      },
      cellStyle: { color: 'blue', cursor: 'pointer' },
      onCellClicked: (event: CellClickedEvent) => {
        this.onOpenViewItems(event.data.items);
      }
    }]
  };
  consumerList: ConsumerSupplierRowModel[];
  ngOnInit(): void {
    this.loading$.next(true);
    this.salesService.getConsumers().subscribe(res => {
      if (this.commonService.isResponseValid(res)) {
        this.loading$.next(false);
        this.consumerList = res.data;
      }
    });
    this.fetchSalesList();
  }

  fetchSalesList() {
    this.loading$.next(true);
    this.salesService.getSales().subscribe(res => {
      this.loading$.next(false);
      const rows: SalesRowModel[] = [];
      res.forEach(cart => {
        const row: SalesRowModel = {
          id: cart.cart.id,
          items: cart.cart.items as ItemRowViewModel[],
          saleDate: cart.cart.saleOrder.saleDate,
          consumerName: cart.cart.saleOrder.consumer.name,
          total: cart.cart.saleOrder.total,
          totalWithoutTax: cart.cart.saleOrder.totalWithoutTax
        };
        rows.push(row);
      });
      this.rowData$.next(rows);
    });
  }

  onOpenAddSaleDialog() {
    const dialogRef = this.dialog.open(AddPurchaseDialogComponent, { data: { suppliers: this.consumerList, selectTitle: 'Consumers',sectionTitle:'Add Sales Entry' } });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.salesService.addSale(result).subscribe(res => {
          this.fetchSalesList();
        });
      }
    });
  }

  onOpenViewItems(items: ItemRowViewModel[]) {
    console.log(items);
    const dialogRef = this.dialog.open(ViewItemsComponent, { data: { items: items } });
  }

}
