using ERP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Domain.Interfaces
{
    public interface IInventoryService
    {
        Task<IEnumerable<ItemResponseModel>> GetItems();
        Task<List<bool>> AddItems(List<ItemRequestModel> requestModel);
    }
}
