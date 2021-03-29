using ERP.Domain.Interfaces;
using ERP.Model;
using ERP.Repository.Interfaces;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ERP.Domain
{
    public class PurchaseService : IPurchaseService
    {
        private readonly IPurchaseRepository purchaseRepository;
        private readonly IInventoryRepository inventoryRepository;
        private readonly ILogger<PurchaseService> _logger;

        public PurchaseService(IPurchaseRepository repository, IInventoryRepository inventory, ILogger<PurchaseService> logger)
        {
            purchaseRepository = repository;
            inventoryRepository = inventory;
            _logger = logger;
        }
        public async Task<BaseResponse<bool>> AddPurchase(AddPurchaseRequestModel requestModel)
        {
            double totalWithoutTax = 0;
            double totalWithTax = 0;
            requestModel.Items.ForEach(item =>
            {
                totalWithoutTax += (item.PriceWithoutTax * item.RequestedQuantity);
                totalWithTax += (item.PriceWithTax * item.RequestedQuantity);
            });
            _logger.LogInformation("Purchase Service - Adding Purchase");
            var res1 = await inventoryRepository.UpdateItemsQuantity(requestModel.Items, false);
            bool resultOfQuery = true;
            for (int i = 0; i < res1.Count; i++)
            {
                if (res1[i] == false)
                {
                    resultOfQuery = false;
                    return new BaseResponse<bool>() { ErrorCode = 1, ErrorMessage = "There was some error adding the purchase", Data = false };
                }
            }
            var result = await purchaseRepository.AddPurchase(requestModel, totalWithTax, totalWithoutTax);
            _logger.LogInformation("Purchase Service - Adding Purchase Successful");
            var finalResult = result && resultOfQuery;
            if (finalResult)
            {
                return new BaseResponse<bool>() { ErrorCode = 0, ErrorMessage = "Success", Data = true };
            }
            else
            {
                return new BaseResponse<bool>() { ErrorCode = 1, ErrorMessage = "There was some error adding the purchase", Data = false };
            }
        }

        public async Task<IEnumerable<PurchasesResponse>> GetPurchases()
        {
            _logger.LogInformation("Purchase Service - Get Purchase");
            var result = await purchaseRepository.GetPurchases();
            _logger.LogInformation("Purchase Service - Get Purchase Successful");
            foreach (var i in result)
            {
                foreach (var item in i.Cart.Items)
                {
                    InventoryService.FillRespectiveProperties(item);
                }
            }
            return result;
        }
    }
}
