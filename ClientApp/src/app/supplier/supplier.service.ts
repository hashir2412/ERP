import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiUrl } from "../api-url";
import { DataStoreKeys } from "../core/data-store-keys";
import { AppMemoryStoreService } from "../shared/services/app-memory-store";
import { ConsumerSupplierRowModel } from "../shared/consumer-supplier-row.viewModel";
import { ResponseModel } from "../shared/response.model";
import { ConsumerFormModel } from "../shared/consumer-form/consumer-form.viewModel";
import { CommonService } from "../shared/services/common.service";

@Injectable()
export class SupplierService {
    constructor(private http: HttpClient, private store: AppMemoryStoreService, private commonService: CommonService) {
    }

    addSupplier(consumer: ConsumerFormModel): Observable<ResponseModel<number>> {
        return this.http.post<ResponseModel<number>>(ApiUrl.suppliersApi, consumer);
    }
    getSuppliers(shouldRefresh: boolean): Observable<ResponseModel<ConsumerSupplierRowModel[]>> {
        if (shouldRefresh) {
            return this.getSupplierList();
        }
        else {
            let data: ConsumerSupplierRowModel[] = this.store.get<ConsumerSupplierRowModel[]>(DataStoreKeys.SuppliersKey);
            return data ? of({ data: data, errorCode: 0, errorMessage: '' }) : this.getSupplierList();
        }
    }


    private getSupplierList(): Observable<ResponseModel<ConsumerSupplierRowModel[]>> {
        return new Observable(o => {
            this.http.get<ResponseModel<ConsumerSupplierRowModel[]>>(ApiUrl.suppliersApi).subscribe(res => {
                if (this.commonService.isResponseValid(res)) {
                    this.store.add(DataStoreKeys.SuppliersKey, res.data);
                    o.next(res);
                }
                o.complete();
            },err => {
                o.error(err);
                o.complete();
            });
        });

    }
}