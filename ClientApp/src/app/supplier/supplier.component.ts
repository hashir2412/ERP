import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject, Subject } from 'rxjs';
import { ConsumerFormComponent } from '../shared/consumer-form/consumer-form.component';
import { ConsumerFormModel, FormModel } from '../shared/consumer-form/consumer-form.viewModel';
import { SupplierService } from './supplier.service';
import { ConsumerSupplierRowModel } from '../shared/consumer-supplier-row.viewModel';
import { CommonService } from '../shared/services/common.service';
import { AppMemoryStoreService } from '../shared/services/app-memory-store';
import { MessageSeverity } from '../shared/message/message.enum';
import { Message } from 'primeng-lts';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierComponent implements OnInit {
  rowData$: BehaviorSubject<ConsumerSupplierRowModel[]> = new BehaviorSubject<ConsumerSupplierRowModel[]>([]);
  messages$: Subject<Message> = new Subject<Message>();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private gridApi: GridApi;
  constructor(private supplierService: SupplierService, private dialog: MatDialog, private store: AppMemoryStoreService, private commonService: CommonService) { }
  gridOptions: GridOptions = {
    pagination: true,
    paginationAutoPageSize: true,
    columnDefs: [{
      headerName: 'Name',
      field: 'name',
      sortable: true, filter: true
    }, {
      headerName: 'GST No.',
      field: 'gstin',
      sortable: true, filter: true
    }, {
      headerName: 'Address',
      field: 'address',
      sortable: true, filter: true
    }, {
      headerName: 'Description',
      field: 'description',
      sortable: true, filter: true
    }],
    onGridReady: (params: GridReadyEvent) => {
      this.gridApi = params.api;
    },
    onRowDataChanged: () => {
      this.gridApi && this.gridApi.hideOverlay();
    },
    overlayLoadingTemplate: 'Please wait while we are fetching data'
  }
  ngOnInit(): void {
    this.getSuppliers(false);
  }

  getSuppliers(refresh: boolean) {
    this.gridApi && this.gridApi.showLoadingOverlay();
    this.loading$.next(true);
    this.supplierService.getSuppliers(refresh).subscribe(res => {
      this.loading$.next(false);
      if (this.commonService.isResponseValid(res)) {
        this.rowData$.next(res.data);
      }

    });
  }

  onOpenAddSupplierDialog() {
    const res: ConsumerFormModel = { address: '', description: '', gstin: '', name: '' };
    const formModel: FormModel = { formData: res, list: this.rowData$.value, title: 'Add new Supplier' };
    const dialogRef = this.dialog.open(ConsumerFormComponent, { data: formModel });

    dialogRef.afterClosed().subscribe((result: ConsumerFormModel) => {
      if (result) {
        this.loading$.next(true);
        this.supplierService.addSupplier(result).subscribe(res => {
          this.loading$.next(false);
          if (this.commonService.isResponseValid(res)) {
            const message = this.commonService.getMessage('Supplier successfully added', 'Success', MessageSeverity.Success);
            this.messages$.next(message);
            this.getSuppliers(true);
          } else {
            const message = this.commonService.getMessage(res.errorMessage, 'Error', MessageSeverity.Error);
            this.messages$.next(message);
          }
        }, err => {
          const message = this.commonService.getMessage(err.message, 'Error', MessageSeverity.Error);
          this.messages$.next(message);
        });
      }
    });
  }

  onRefresh() {
    this.getSuppliers(true);
  }

}
