import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Message } from 'primeng-lts';
import { BehaviorSubject, Subject } from 'rxjs';
import { ConsumerFormComponent } from '../shared/consumer-form/consumer-form.component';
import { ConsumerFormModel, FormModel } from '../shared/consumer-form/consumer-form.viewModel';
import { ConsumerSupplierRowModel } from '../shared/consumer-supplier-row.viewModel';
import { MessageSeverity } from '../shared/message/message.enum';
import { CommonService } from '../shared/services/common.service';
import { ConsumersService } from './consumers.service';

@Component({
  selector: 'app-consumers',
  templateUrl: './consumers.component.html',
  styleUrls: ['./consumers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsumersComponent implements OnInit {

  rowData$: BehaviorSubject<ConsumerSupplierRowModel[]> = new BehaviorSubject<ConsumerSupplierRowModel[]>([]);
  messages$: Subject<Message> = new Subject<Message>();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private gridApi: GridApi;
  constructor(private consumerService: ConsumersService, private dialog: MatDialog, private commonService: CommonService) { }
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
    this.getConsumers(false);
  }

  getConsumers(refresh: boolean) {
    this.gridApi && this.gridApi.showLoadingOverlay();
    this.loading$.next(true);
    this.consumerService.getConsumers(refresh).subscribe(res => {
      this.loading$.next(false);
      if (this.commonService.isResponseValid(res)) {
        this.rowData$.next(res.data);
      }

    });
  }

  onOpenAddConsumerDialog() {
    const res: ConsumerFormModel = { address: '', description: '', gstin: '', name: '' };
    const formModel: FormModel = { formData: res, list: this.rowData$.value, title: 'Add new Consumer' };
    const dialogRef = this.dialog.open(ConsumerFormComponent, { data: formModel });

    dialogRef.afterClosed().subscribe((result: ConsumerFormModel) => {
      if (result) {
        this.loading$.next(true);
        this.consumerService.addConsumers(result).subscribe(res => {
          this.loading$.next(false);
          if (this.commonService.isResponseValid(res)) {
            const message = this.commonService.getMessage('Customer successfully added', 'Success', MessageSeverity.Success);
            this.messages$.next(message);
            this.getConsumers(true);
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
    this.getConsumers(true);
  }
}
