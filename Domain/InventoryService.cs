using ERP.Domain.Interfaces;
using ERP.Model;
using ERP.Repository.Interfaces;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Domain
{
    public class InventoryService : IInventoryService
    {
        public static readonly string SPLITSENTENCE = "<nextElement>";
        private readonly IInventoryRepository inventoryRepository;
        private readonly ILogger<InventoryService> _logger;
        public InventoryService(IInventoryRepository repo, ILogger<InventoryService> logger)
        {
            inventoryRepository = repo;
            _logger = logger;
        }

        public async Task<List<bool>> AddItems(List<ItemRequestModel> requestModel)
        {
            _logger.LogInformation("Inventory service - Add Items");
            var result = await GetItems();
            for (int i = 0; i < requestModel.Count; i++)
            {
                _logger.LogInformation($"Items {requestModel[i].Name} {requestModel[i].QuantityValue} {requestModel[i].QuantityName}");
                var itemName = requestModel[i].QuantityName + requestModel[i].QuantityValue + requestModel[i].Name;
                var duplicateEntry = result.FirstOrDefault(item => item.QuantityName + item.QuantityValue + item.Name == itemName);
                if (duplicateEntry != null)
                {
                    requestModel.Remove(requestModel[i]);
                }
            }
            var res = await inventoryRepository.AddItems(requestModel);
            _logger.LogInformation("Inventory service - Add Items successful");
            return res;
        }

        public async Task<IEnumerable<ItemResponseModel>> GetItems()
        {
            _logger.LogInformation("Inventory service - Get Items");
            var result = await inventoryRepository.GetItems();
            _logger.LogInformation("Inventory service - Get Items successful");
            foreach (var i in result)
            {
                FillRespectiveProperties(i);
            }
            return result;
        }

        public static void FillRespectiveProperties(ItemResponseModel item)
        {
            var itemMeasure = item.RawName.Split(SPLITSENTENCE);
            if (itemMeasure.Length == 3)
            {
                item.QuantityName = itemMeasure[0];
                item.QuantityValue = itemMeasure[1];
                item.Name = itemMeasure[2];
            }
        }

        public string FormatStringName(string name)
        {
            return string.Join("", name.Split(SPLITSENTENCE));
        }
    }
}
