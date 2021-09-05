using System.Collections.Generic;

namespace ERP.Model.DbModel
{
    public class PurchaseCartDbModel
    {
        public int PurchaseCartId { get; set; }

        public string PurhcaseOrderID { get; set; }

        public int ItemID { get; set; }

        public int Quantity { get; set; }

        public InventoryDbModel Item { get; set; }

        public PurchaseOrderDbModel Order { get; set; }
    }
}
