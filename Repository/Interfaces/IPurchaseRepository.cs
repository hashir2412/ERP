using ERP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Repository.Interfaces
{
    public interface IPurchaseRepository
    {
        Task<int> AddPurchase(AddPurchaseRequestModel requestModel,double total, double totalWithoutTax);

        Task<IEnumerable<PurchasesResponse>> GetPurchases();
    }
}
