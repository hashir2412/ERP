import { MeasureQuantityName } from "../inventory/inventory.viewModel";

export class SelectionItemValue {
    value: MeasureQuantityName;
    headerName: string;
}

export const UnitOfMeasurement: SelectionItemValue[] = [{
    value: MeasureQuantityName.Gram, headerName: 'Gram'
}, {
    value: MeasureQuantityName.Kilogram, headerName: 'Kg'
},
{
    value: MeasureQuantityName.MiliLitre, headerName: 'Ml'
},
{
    value: MeasureQuantityName.Litre, headerName: 'Litre'
}];