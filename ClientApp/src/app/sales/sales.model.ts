import { AddItemRequestModel } from "../inventory/inventory.model";
import { ConsumerSupplierRowModel } from "../shared/consumer-supplier-row.viewModel";

export class AddSaleRequestModel {
    consumerId: number;
    items: AddItemRequestModel[];
    subTotal: number;
    total: number;
    saleDateTime: string;
}

export class SaleCartModel {
    cart: SaleModel;
}

export class SaleModel {
    id: number;
    items: AddItemRequestModel[];
    saleOrder: SaleOrderModel;
}

export class SaleOrderModel {
    id: number;
    saleDate: Date;
    consumer: ConsumerSupplierRowModel;
    total: number;
    totalWithoutTax: number;
}