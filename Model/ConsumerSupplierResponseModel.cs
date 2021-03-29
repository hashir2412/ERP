using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Model
{
    public class ConsumerSupplierResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string GSTIN { get; set; }

        public string Address { get; set; }

        public string Description { get; set; }
    }
}
