using System.Collections.Generic;

namespace ERP.Model.DbModel
{
    public class SalesCartDbModel
    {
        public int SalesCartId { get; set; }

        public int SalesOrderID { get; set; }

        public int ItemID { get; set; }

        public int Quantity { get; set; }

        public InventoryDbModel Item { get; set; }

        public SalesOrderDbModel Order { get; set; }

        public double SellingPriceWithoutTax { get; set; }

        public double SellingPriceWithTax { get; set; }
    }
}
