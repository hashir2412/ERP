namespace ERP.Model.DbModel
{
    public class InventoryDbModel
    {
        public int InventoryId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int Quantity { get; set; }

        public double PriceWithoutTax { get; set; }

        public double GST { get; set; }

        public double PriceWithTax { get; set; }

        public string RawName { get; set; }

        public int RequestedQuantity { get; set; }

        public double SellingPriceWithTax { get; set; }

        public double SellingPriceWithoutTax { get; set; }

    }
}
