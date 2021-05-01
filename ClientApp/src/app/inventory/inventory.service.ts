import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiUrl } from "../api-url";
import { DataStoreKeys } from "../core/data-store-keys";
import { AppMemoryStoreService } from "../shared/services/app-memory-store";
import { AddItemRequestModel } from "./inventory.model";
import { ItemRowViewModel as ItemRowViewModel } from "./inventory.viewModel";
import * as deepClone from 'lodash';
@Injectable()
export class InventoryService {
    constructor(private http: HttpClient, private store: AppMemoryStoreService) {
    }
    getItems(shouldRefresh: boolean): Observable<ItemRowViewModel[]> {
        if (shouldRefresh) {
            return this.getItemsList();
        }
        else {
            let data: ItemRowViewModel[] = deepClone.cloneDeep(this.store.get<ItemRowViewModel[]>(DataStoreKeys.InventoryKey));
            return data ? of(data) : this.getItemsList();
        }
    }

    addItem(item: ItemRowViewModel): Observable<boolean[]> {
        const requestModel: AddItemRequestModel = {
            description: item.description, gst: item.gst, quantityName: item.quantityName, quantityValue: item.quantityValue,
            name: item.name, priceWithTax: item.priceWithTax, priceWithoutTax: item.priceWithoutTax, quantity: item.quantity,
            sellingPriceWithTax: item.sellingPriceWithTax, sellingPriceWithoutTax: item.sellingPriceWithoutTax
        }
        return this.http.post<boolean[]>(ApiUrl.inventoryApi, [requestModel]);

    }


    private getItemsList(): Observable<ItemRowViewModel[]> {
        return new Observable(o => {
            this.http.get<ItemRowViewModel[]>(ApiUrl.inventoryApi).subscribe(res => {
                this.store.add(DataStoreKeys.InventoryKey, res);
                o.next(res);
                o.complete();
            });

        });

    }
}