using System.Collections.Generic;

namespace ERP.Model.DbModel
{
    public class PurchaseCartDbModel
    {
        public int PurchaseCartId { get; set; }

        public int PurhcaseOrderID { get; set; }

        public int ItemID { get; set; }

        public int Quantity { get; set; }

        public List<InventoryDbModel> Items { get; set; } = new List<InventoryDbModel>();

        public PurchaseOrderDbModel Order { get; set; }
    }
}
