using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Model
{
    public class AddPurchaseRequestModel
    {
        public int SupplierId { get; set; }

        public List<ItemRequestModel> Items { get; set; }
    }
}
