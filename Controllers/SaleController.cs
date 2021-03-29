using ERP.Domain.Interfaces;
using ERP.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ERP.Controllers
{

    [Route("api/sale")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private ISalesService salesService;
        private ILogger<SaleController> _logger;
        public SaleController(ISalesService service, ILogger<SaleController> logger)
        {
            salesService = service;
            _logger = logger;
        }
        // GET: api/<PurchaseController>
        [HttpGet]
        public async Task<IEnumerable<SalesResponse>> Get()
        {
            _logger.LogInformation("Get sales");
            return await salesService.GetSales();
        }

        // GET api/<PurchaseController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<PurchaseController>
        [HttpPost]
        public async Task<BaseResponse<int>> AddSale([FromBody] AddSaleRequestModel requestModel)
        {
            for (int i = 0; i < requestModel.Items.Count; i++)
            {
                if (requestModel.Items[i].RequestedQuantity > requestModel.Items[i].Quantity)
                {
                    return new BaseResponse<int>() { ErrorCode = 1, ErrorMessage = $"Requested quantity more than the existing quantity for item {requestModel.Items[i].Name} {requestModel.Items[i].QuantityValue} {requestModel.Items[i].QuantityName}", Data = 0 };
                }
            }
            _logger.LogInformation("Add Sale");
            var result = await salesService.AddSale(requestModel);
            return new BaseResponse<int>() { ErrorCode = 0, ErrorMessage = "Success", Data = result };
        }

        // PUT api/<PurchaseController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<PurchaseController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }

}