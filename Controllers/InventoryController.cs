using ERP.Domain.Interfaces;
using ERP.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Controllers
{
    [Route("api/inventory")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService inventoryService;
        private readonly ILogger<InventoryController> _logger;
        public InventoryController(IInventoryService service, ILogger<InventoryController> logger)
        {
            inventoryService = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<ItemResponseModel>> GetItems()
        {
            _logger.LogInformation("Get Inventories");
            return await inventoryService.GetItems();
        }

        [HttpPost]
        public Task<List<bool>> AddItems([FromBody] List<ItemRequestModel> requestModel)
        {
            _logger.LogInformation("Add Inventories");
            return inventoryService.AddItems(requestModel);
        }
    }
}
