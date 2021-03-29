using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Model
{
    public class Item
    {
        public int? Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int Quantity { get; set; }

        public double PriceWithoutTax { get; set; }

        public double GST { get; set; }

        public double PriceWithTax { get; set; }
    }
}
