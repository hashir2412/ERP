using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Model
{
    public class AddPurchaseRequestModel
    {
        public string OrderId { get; set; }
        public int SupplierId { get; set; }

        public List<ItemRequestModel> Items { get; set; }

        public double SubTotal { get; set; }
        public double Total { get; set; }

        public DateTime PurchaseDateTime { get; set; }
    }
}
