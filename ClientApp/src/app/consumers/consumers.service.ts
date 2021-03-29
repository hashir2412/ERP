import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiUrl } from "../api-url";
import { DataStoreKeys } from "../core/data-store-keys";
import { ConsumerFormModel } from "../shared/consumer-form/consumer-form.viewModel";
import { ConsumerSupplierRowModel } from "../shared/consumer-supplier-row.viewModel";
import { ResponseModel } from "../shared/response.model";
import { AppMemoryStoreService } from "../shared/services/app-memory-store";
import { CommonService } from "../shared/services/common.service";

@Injectable()
export class ConsumersService {
    constructor(private http: HttpClient, private store: AppMemoryStoreService, private commonService: CommonService) {
    }
    getConsumers(shouldRefresh: boolean): Observable<ResponseModel<ConsumerSupplierRowModel[]>> {
        if (shouldRefresh) {
            return this.getConsumersList();
        }
        else {
            let data: ConsumerSupplierRowModel[] = this.store.get<ConsumerSupplierRowModel[]>(DataStoreKeys.ConsumerKey);
            return data ? of({ data: data, errorCode: 0, errorMessage: '' }) : this.getConsumersList();
        }
        // return this.http.get<ResponseModel<ConsumerSupplierRowModel[]>>(ApiUrl.consumerapi);
    }

    private getConsumersList(): Observable<ResponseModel<ConsumerSupplierRowModel[]>> {
        return new Observable(o => {
            this.http.get<ResponseModel<ConsumerSupplierRowModel[]>>(ApiUrl.consumerapi).subscribe(res => {
                if (this.commonService.isResponseValid(res)) {
                    this.store.add(DataStoreKeys.ConsumerKey, res.data);
                    o.next(res);
                }
                o.complete();
            }, err => {
                o.error(err);
                o.complete();
            });
        });

    }

    addConsumers(consumer: ConsumerFormModel): Observable<ResponseModel<number>> {
        return this.http.post<ResponseModel<number>>(ApiUrl.consumerapi, consumer);
    }
}