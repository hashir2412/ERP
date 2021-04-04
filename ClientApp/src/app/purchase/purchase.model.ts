import { AddItemRequestModel } from "../inventory/inventory.model";
import { ConsumerSupplierRowModel } from "../shared/consumer-supplier-row.viewModel";

export class AddPurchaseRequestModel {
    supplierId: number;
    items: AddItemRequestModel[];
    subTotal: number;
    total: number;
}

export class PurchaseCartModel{
    cart: PurchaseModel;
}

export class PurchaseModel {
    id: number;
    items: AddItemRequestModel[];
    purchaseOrder: PurchaseOrderModel;
}

export class PurchaseOrderModel {
    id: number;
    purchaseDate: Date;
    supplier: ConsumerSupplierRowModel;
    total: number;
    totalWithoutTax: number;
}