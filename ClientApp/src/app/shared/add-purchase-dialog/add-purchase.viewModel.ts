import { ItemRowViewModel, MeasureQuantityName } from "src/app/inventory/inventory.viewModel";
import { ConsumerSupplierRowModel } from "src/app/shared/consumer-supplier-row.viewModel";

export class AddPurchaseModel {
    supplier: ConsumerSupplierRowModel;
    items: ItemRowViewModel[] = [new ItemRowViewModel()];
    subTotal?: number;
    total?: number;
}
