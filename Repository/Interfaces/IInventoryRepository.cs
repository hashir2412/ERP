using ERP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Repository.Interfaces
{
    public interface IInventoryRepository
    {
        Task<List<bool>> AddItems(List<ItemRequestModel> items);

        Task<IEnumerable<ItemResponseModel>> GetItems();

        Task<List<bool>> UpdateItemsQuantity(List<ItemRequestModel> items, bool isSale);
    }
}
