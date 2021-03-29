import { ItemRowViewModel } from "../inventory/inventory.viewModel";

export class SalesRowModel{
    id: number;
    items: ItemRowViewModel[];
    saleDate: Date;
    total: number;
    totalWithoutTax: number;
    consumerName: string;
}