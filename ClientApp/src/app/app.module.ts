import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SupplierComponent } from './supplier/supplier.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConsumerFormComponent } from './shared/consumer-form/consumer-form.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SalesComponent } from './sales/sales.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SupplierService } from './supplier/supplier.service';
import { AppMemoryStoreService } from './shared/services/app-memory-store';
import { MatSelectModule } from '@angular/material/select';
import { AddPurchaseDialogComponent } from './shared/add-purchase-dialog/add-purchase-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InventoryService } from './inventory/inventory.service';
import { AddEditInventoryDialogComponent } from './inventory/add-edit-inventory-dialog/add-edit-inventory-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ViewItemsComponent } from './purchase/view-items/view-items.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingComponent } from './shared/loading/loading.component';
import { ConsumersComponent } from './consumers/consumers.component';
import { CommonService } from './shared/services/common.service';
import { MessageComponent } from './shared/message/message.component';
import { ConsumersService } from './consumers/consumers.service';
import { MessageModule, MessagesModule } from 'primeng-lts';
import { DatePipe } from '@angular/common';
import { httpInterceptorProviders } from './interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    AppComponent,
    SupplierComponent,
    ConsumerFormComponent,
    SalesComponent,
    PurchaseComponent,
    InventoryComponent,
    AddPurchaseDialogComponent,
    AddEditInventoryDialogComponent,
    ViewItemsComponent,
    LoadingComponent,
    ConsumersComponent,
    MessageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    AgGridModule.withComponents([]),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MessagesModule,
    MessageModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule
  ],
  entryComponents: [ConsumerFormComponent],
  providers: [httpInterceptorProviders,
    AppMemoryStoreService, SupplierService, InventoryService, ConsumersService, CommonService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
