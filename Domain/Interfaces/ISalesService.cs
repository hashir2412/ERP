using ERP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Domain.Interfaces
{
    public interface ISalesService
    {
        Task<bool> AddSale(AddSaleRequestModel requestModel);

        Task<IEnumerable<SalesResponse>> GetSales();


    }
}
