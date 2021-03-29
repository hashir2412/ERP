import { ConsumerSupplierRowModel } from "../consumer-supplier-row.viewModel";

export class ConsumerFormModel {
    id?: number;
    name: string;
    gstin: string;
    address: string;
    description: string;
}

export class FormModel{
    formData: ConsumerFormModel;
    title: string;
    list: ConsumerSupplierRowModel[];
}
