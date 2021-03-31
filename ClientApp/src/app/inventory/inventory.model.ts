import { MeasureQuantityName } from "./inventory.viewModel";

export class AddItemRequestModel {
    id?: number;
    name: string;
    description: string;
    quantity: number;
    quantityName: MeasureQuantityName;
    quantityValue: string;
    priceWithoutTax: number;
    gst: number;
    priceWithTax: number;
    requestedQuantity?: number;
    subtractedQuantity?: number;
    sellingPriceWithoutTax: number;
    sellingPriceWithTax: number;
}
