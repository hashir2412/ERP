import { ItemRowViewModel } from "../inventory/inventory.viewModel";
import { ConsumerSupplierRowModel } from "../shared/consumer-supplier-row.viewModel";

export class PurchaseRowModel {
    id: string;
    items: ItemRowViewModel[];
    purchaseDate: Date;
    total: number;
    totalWithoutTax: number;
    supplierName: string;
    supplier: ConsumerSupplierRowModel;
}
