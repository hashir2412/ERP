using ERP.Domain.Interfaces;
using ERP.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ERP.Controllers
{

    [Route("api/purchase")]
    [ApiController]
    public class PurchaseController : ControllerBase
    {
        private IPurchaseService purchaseService;
        private readonly ILogger<PurchaseController> _logger;
        public PurchaseController(IPurchaseService service, ILogger<PurchaseController> logger)
        {
            purchaseService = service;
            _logger = logger;
        }
        // GET: api/<PurchaseController>
        [HttpGet]
        public async Task<BaseResponse<IEnumerable<PurchasesResponse>>> Get()
        {
            _logger.LogInformation("Get Purchases");
            var result = await purchaseService.GetPurchases();
            return new BaseResponse<IEnumerable<PurchasesResponse>>() { ErrorCode = 0, ErrorMessage = "Success", Data = result };
        }

        // GET api/<PurchaseController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<PurchaseController>
        [HttpPost]
        public async Task<BaseResponse<int>> AddPurchase([FromBody] AddPurchaseRequestModel requestModel)
        {
            _logger.LogInformation($"Add Purchase {requestModel.SupplierId}");
            return await purchaseService.AddPurchase(requestModel);
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
