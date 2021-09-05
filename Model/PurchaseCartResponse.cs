using System.Collections.Generic;

namespace ERP.Model
{
    public class PurchaseCartResponse
    {
        public string Id { get; set; }
        public PurchaseOrderResponse PurchaseOrder { get; set; }

        public List<ItemResponseModel> Items { get; set; }
    }
}
