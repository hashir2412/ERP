import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiUrl } from "../api-url";
import { ConsumersService } from "../consumers/consumers.service";
import { AddPurchaseModel } from "../shared/add-purchase-dialog/add-purchase.viewModel";
import { ConsumerSupplierRowModel } from "../shared/consumer-supplier-row.viewModel";
import { ResponseModel } from "../shared/response.model";
import { AddSaleRequestModel, SaleCartModel } from "./sales.model";

@Injectable()
export class SalesService {
    constructor(private http: HttpClient, private consumerService: ConsumersService) {

    }

    getPurchaseList() {
        // return this.http.get<SupplierRowModel[]>(ApiUrl.requestApi);
    }

    addSale(addPurchaseViewModel: AddPurchaseModel): Observable<ResponseModel<number>> {
        const requestModel: AddSaleRequestModel = {
            consumerId: addPurchaseViewModel.supplier.id,
            items: addPurchaseViewModel.items,
            subTotal: addPurchaseViewModel.subTotal,
            total: addPurchaseViewModel.total,
            saleDateTime: addPurchaseViewModel.invoiceDateTime.toLocaleString(),
            orderId: addPurchaseViewModel.orderId
        };
        return this.http.post<ResponseModel<number>>(ApiUrl.saleApi, requestModel);
    }

    getConsumers(): Observable<ResponseModel<ConsumerSupplierRowModel[]>> {
        return this.consumerService.getConsumers(false);
    }

    getSales(): Observable<SaleCartModel[]> {
        return this.http.get<SaleCartModel[]>(ApiUrl.saleApi);
    }
}