using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Model
{
    public class SaleCartResponse
    {
        public int Id { get; set; }
        public SaleOrderResponse SaleOrder { get; set; }

        public List<ItemResponseModel> Items { get; set; }
    }
}
