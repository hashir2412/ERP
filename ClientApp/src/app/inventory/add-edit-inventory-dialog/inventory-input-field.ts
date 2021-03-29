import { SelectionItemValue, UnitOfMeasurement as UNIT_OF_MEASUREMENT } from "src/app/constants/selection-item";
import { InputField } from "src/app/shared/consumer-form/input-field";
import { MeasureQuantityName } from "../inventory.viewModel";

export enum InputType {
    Text,
    Number,
    DropDown
}

export const InventoryInputFields: InventoryInputField[] = [{
    field: 'name', headerName: 'Item Name', type: InputType.Text, required: true
},
{
    field: 'description', headerName: 'Item Description', type: InputType.Text
},
{
    field: 'quantityName', headerName: 'Unit of Measurement', type: InputType.DropDown, selectionValues: UNIT_OF_MEASUREMENT, required: true
},
{
    field: 'quantityValue', headerName: 'Value of Measurement', type: InputType.Number, required: true
}
];

export class InventoryInputField extends InputField {
    type: InputType;
    isDisabled?: boolean;
    selectionValues?: SelectionItemValue[];
}

