using System;

namespace ERP.Model
{
    public class PurchaseOrderResponse
    {
        public string Id { get; set; }
        public ConsumerSupplierResponseModel Supplier { get; set; }

        public DateTime PurchaseDate { get; set; }

        public double Total { get; set; }

        public double TotalWithoutTax { get; set; }
    }
}
