using System.Collections.Generic;

namespace ERP.Model.DbModel
{
    public class SalesCartDbModel
    {
        public int SalesCartId { get; set; }

        public int SalesOrderID { get; set; }

        public int ItemID { get; set; }

        public int Quantity { get; set; }

        public List<InventoryDbModel> Items { get; set; } = new List<InventoryDbModel>();

        public SalesOrderDbModel Order { get; set; }
    }
}
