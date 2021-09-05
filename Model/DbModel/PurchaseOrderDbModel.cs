using System;

namespace ERP.Model.DbModel
{
    public class PurchaseOrderDbModel
    {
        public string PurchaseOrderId { get; set; }

        public int SupplierID { get; set; }

        public DateTime PurchaseDate { get; set; }

        public double Total { get; set; }

        public double TotalWithoutTax { get; set; }

        public SupplierDbModel Supplier { get; set; }
    }
}
