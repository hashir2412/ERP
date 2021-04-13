import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { BehaviorSubject, Subject } from 'rxjs';
import { SupplierService } from '../supplier/supplier.service';
import { ConsumerSupplierRowModel } from '../shared/consumer-supplier-row.viewModel';
import { AddPurchaseDialogComponent } from '../shared/add-purchase-dialog/add-purchase-dialog.component';
import { PurchaseService } from './purchase.service';
import { PurchaseRowModel } from './purchase.viewModel';
import { ItemRowViewModel, MeasureQuantityName } from '../inventory/inventory.viewModel';
import { DatePipe } from '@angular/common';
import { ViewItemsComponent } from './view-items/view-items.component';
import { CommonService } from '../shared/services/common.service';
import { Message } from 'primeng-lts';
import { MessageSeverity } from '../shared/message/message.enum';
import { BillType } from '../shared/add-purchase-dialog/add-purchase.enum';
import { AddPurchaseModel } from '../shared/add-purchase-dialog/add-purchase.viewModel';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PurchaseService, DatePipe]
})
export class PurchaseComponent implements OnInit {
  rowData$: BehaviorSubject<PurchaseRowModel[]> = new BehaviorSubject<PurchaseRowModel[]>([]);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  messages$: Subject<Message> = new Subject<Message>();
  constructor(private purchaseService: PurchaseService, private dialog: MatDialog, private supplierService: SupplierService,
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
    columnDefs: [
      {
        headerName: 'Invoice Number',
        field: 'id'
      },
      {
        headerName: 'Supplier Name',
        field: 'supplierName'
      }, {
        headerName: 'Purchase Date',
        field: 'purchaseDate',
        valueFormatter: (params: ValueFormatterParams) => {
          return this.datePipe.transform(params.value, 'short');
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
      },
      {
        filter: false,
        valueGetter: () => {
          return 'Print Invoice';
        },
        cellStyle: { color: 'blue', cursor: 'pointer' },
        onCellClicked: (event: CellClickedEvent) => {
          const data = event.data as PurchaseRowModel;
          this.loading$.next(true);
          this.commonService.printInvoice(data.id, {
            items: data.items, supplier: data.supplier, subTotal: data.totalWithoutTax, total: data.total, invoiceDateTime: data.purchaseDate
          }, BillType.Purchase);
          this.loading$.next(false);
        }
      }]
  };
  supplierList: ConsumerSupplierRowModel[];
  ngOnInit(): void {
    this.loading$.next(true);
    this.supplierService.getSuppliers(false).subscribe(res => {
      this.loading$.next(false);
      if (this.commonService.isResponseValid(res)) {
        this.supplierList = res.data;
      }
    });
    this.fetchPurchaseList();
  }

  fetchPurchaseList() {
    this.loading$.next(true);
    this.purchaseService.getPurchaseList().subscribe(res => {
      this.loading$.next(false);
      if (this.commonService.isResponseValid(res)) {
        const rows: PurchaseRowModel[] = [];
        res.data.forEach(cart => {
          const row: PurchaseRowModel = {
            id: cart.cart.id,
            items: cart.cart.items as ItemRowViewModel[],
            purchaseDate: cart.cart.purchaseOrder.purchaseDate,
            supplierName: cart.cart.purchaseOrder.supplier.name,
            total: cart.cart.purchaseOrder.total,
            totalWithoutTax: cart.cart.purchaseOrder.totalWithoutTax,
            supplier: cart.cart.purchaseOrder.supplier
          };
          rows.push(row);
        });
        this.rowData$.next(rows);
      }
      else {
        const message = this.commonService.getMessage(res.errorMessage, 'Error', MessageSeverity.Error);
        this.messages$.next(message);
      }
    }, err => {
      const message = this.commonService.getMessage(err.message, 'Error', MessageSeverity.Error);
      this.messages$.next(message);
    });
  }

  onOpenAddPurchaseDialog() {
    const dialogRef = this.dialog.open(AddPurchaseDialogComponent, { data: { suppliers: this.supplierList, selectTitle: 'Suppliers', sectionTitle: BillType.Purchase } });

    dialogRef.afterClosed().subscribe((result: AddPurchaseModel) => {
      if (result) {
        this.loading$.next(true);
        this.purchaseService.addPurchase(result).subscribe(res => {
          this.loading$.next(false);
          if (this.commonService.isResponseValid(res)) {
            const message = this.commonService.getMessage('Purchase successfully added', 'Success', MessageSeverity.Success);
            this.messages$.next(message);
            this.commonService.printInvoice(res.data, result, BillType.Purchase);
            this.fetchPurchaseList();
          }
          else {
            const message = this.commonService.getMessage(res.errorMessage, 'Error', MessageSeverity.Error);
            this.messages$.next(message);
          }
        }, err => {
          this.loading$.next(false);
          const message = this.commonService.getMessage(err.message, 'Error', MessageSeverity.Error);
          this.messages$.next(message);
        }
        );
      }
    });
  }

  onOpenViewItems(items: ItemRowViewModel[]) {
    const dialogRef = this.dialog.open(ViewItemsComponent, { data: { items: items, billType: BillType.Purchase } });
  }

  onRefresh() {
    this.fetchPurchaseList();
  }
}
