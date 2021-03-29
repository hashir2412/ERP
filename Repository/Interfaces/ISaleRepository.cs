using ERP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Repository.Interfaces
{
    public interface ISaleRepository
    {
        Task<int> AddSale(AddSaleRequestModel requestModel, double total, double totalWithoutTax);

        Task<IEnumerable<SalesResponse>> GetSales();

    }
}
