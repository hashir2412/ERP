using ERP.Domain.Interfaces;
using ERP.Model;
using ERP.Repository.Interfaces;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ERP.Domain
{
    public class SalesService : ISalesService
    {

        private readonly ISaleRepository saleRepository;
        private readonly IInventoryRepository inventoryRepository;
        private readonly ILogger<SalesService> _logger;

        public SalesService(ISaleRepository repository, IInventoryRepository inventory, ILogger<SalesService> logger)
        {
            saleRepository = repository;
            inventoryRepository = inventory;
            _logger = logger;
        }
        public async Task<BaseResponse<int>> AddSale(AddSaleRequestModel requestModel)
        {
            double totalWithoutTax = 0;
            double totalWithTax = 0;
            requestModel.Items.ForEach(item =>
            {
                totalWithoutTax += (item.PriceWithoutTax * item.RequestedQuantity);
                totalWithTax += (item.PriceWithTax * item.RequestedQuantity);
            });
            _logger.LogInformation("Sales Service - Adding Sales");
            var res1 = await inventoryRepository.UpdateItemsQuantity(requestModel.Items, true);
            var result = await saleRepository.AddSale(requestModel, totalWithTax, totalWithoutTax);
            bool resultOfQuery = true;
            for (int i = 0; i < res1.Count; i++)
            {
                if (res1[i] == false)
                {
                    resultOfQuery = false;
                    break;
                }
            }
            _logger.LogInformation("Sales Service - Adding Sale Successful");
            var finalResult = result > 0 && resultOfQuery;
            if (finalResult)
            {
                return new BaseResponse<int>() { ErrorCode = 0, ErrorMessage = "Success", Data = result };
            }
            else
            {
                return new BaseResponse<int>() { ErrorCode = 1, ErrorMessage = "There was some error adding the sale", Data = 0 };
            }
        }

        public async Task<IEnumerable<SalesResponse>> GetSales()
        {
            _logger.LogInformation("Sales Service - Get Sales");
            var result = await saleRepository.GetSales();
            _logger.LogInformation("Sales Service - Get Sales Successful");
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