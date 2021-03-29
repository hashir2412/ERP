export class ItemRowViewModel {
    id?: number;
    name: string;
    description: string;
    quantity: number;
    quantityName: MeasureQuantityName;
    quantityValue: string;
    priceWithoutTax: number;
    gst: number;
    priceWithTax: number;
    rawName: string;
    requestedQuantity?: number;
    sellingPriceWithoutTax: number;
    sellingPriceWithTax: number;
}


export enum MeasureQuantityName {
    Gram = 'gram',
    Kilogram = 'kilogram',
    MiliLitre = 'mililitre',
    Litre = 'litre'
}