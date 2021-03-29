namespace ERP.Model
{
    public class ItemRequestModel
    {
        public int? Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int Quantity { get; set; }

        public string QuantityName { get; set; }

        public string QuantityValue { get; set; }

        public double PriceWithoutTax { get; set; }

        public double GST { get; set; }

        public double PriceWithTax { get; set; }

        public int RequestedQuantity { get; set; }

        public double SellingPriceWithoutTax { get; set; }

        public double SellingPriceWithTax { get; set; }

    }
}
