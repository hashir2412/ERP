import { ItemRowViewModel } from "../inventory/inventory.viewModel";
import { ConsumerSupplierRowModel } from "../shared/consumer-supplier-row.viewModel";

export class SalesRowModel{
    id: number;
    items: ItemRowViewModel[];
    saleDate: Date;
    total: number;
    totalWithoutTax: number;
    consumerName: string;
    customer: ConsumerSupplierRowModel;
}