using ERP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Domain.Interfaces
{
    public interface IPurchaseService
    {
        Task<BaseResponse<int>> AddPurchase(AddPurchaseRequestModel requestModel);

        Task<IEnumerable<PurchasesResponse>> GetPurchases();


    }
}
