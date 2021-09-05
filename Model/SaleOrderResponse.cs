using System;

namespace ERP.Model
{
    public class SaleOrderResponse
    {
        public string Id { get; set; }
        public ConsumerSupplierResponseModel Consumer { get; set; }

        public DateTime SaleDate { get; set; }

        public double Total { get; set; }

        public double TotalWithoutTax { get; set; }
    }
}
