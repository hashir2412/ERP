import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiUrl } from "../api-url";
import { AddPurchaseModel } from "../shared/add-purchase-dialog/add-purchase.viewModel";
import { ResponseModel } from "../shared/response.model";
import { AddPurchaseRequestModel, PurchaseCartModel } from "./purchase.model";
import { PurchaseRowModel } from "./purchase.viewModel";

@Injectable()
export class PurchaseService {
    /**
     *
     */
    constructor(private http: HttpClient) {

    }

    getPurchaseList(): Observable<ResponseModel<PurchaseCartModel[]>> {
        return this.http.get<ResponseModel<PurchaseCartModel[]>>(ApiUrl.purchaseApi);
    }

    addPurchase(addPurchaseViewModel: AddPurchaseModel): Observable<ResponseModel<number>> {
        const requestModel: AddPurchaseRequestModel = {
            supplierId: addPurchaseViewModel.supplier.id,
            items: addPurchaseViewModel.items,
            subTotal : addPurchaseViewModel.subTotal,
            total: addPurchaseViewModel.total
        };
        return this.http.post<ResponseModel<number>>(ApiUrl.purchaseApi, requestModel);
    }
}