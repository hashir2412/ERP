using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Model
{
    public class PurchaseResponseModel
    {
        public string Name { get; set; }

        public DateTime PurchaseDate { get; set; }
        public double TotalWithoutTax { get; set; }
        public double TotalWithTax { get; set; }

        public List<ItemResponseModel> Items { get; set; }
        public int Quantity { get; set; }
    }
}
