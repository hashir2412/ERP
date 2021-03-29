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
    [Route("api/consumer")]
    [ApiController]
    public class ConsumerController : ControllerBase
    {
        private IConsumerService consumerService;
        private readonly ILogger<ConsumerController> _logger;

        public ConsumerController(IConsumerService service, ILogger<ConsumerController> logger)
        {
            consumerService = service;
            _logger = logger;
        }
        // GET: api/<ConsumerController>
        [HttpGet]
        public async Task<BaseResponse<IEnumerable<ConsumerSupplierResponseModel>>> GetConsumer()
        {
            _logger.LogInformation("Get Consumers");
            var result = await consumerService.GetConsumers();
            return new BaseResponse<IEnumerable<ConsumerSupplierResponseModel>>() { ErrorCode = 0,ErrorMessage = "Success",Data = result};
        }

        // GET api/<ConsumerController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ConsumerController>
        [HttpPost]
        public async Task<BaseResponse<int>> AddConsumer(ConsumerSupplierResponseModel requestModel)
        {
            _logger.LogInformation($"Add Consumers {requestModel.Name}");
            var result = await consumerService.AddConsumer(requestModel);
            return new BaseResponse<int>() { ErrorCode = 0, ErrorMessage = "Success", Data = result };
        }

        // PUT api/<ConsumerController>/5
        [HttpPut("{id}")]
        public async Task<BaseResponse<int>> UpdateConsumer(ConsumerSupplierResponseModel requestModel)
        {
            _logger.LogInformation($"Update Consumers {requestModel.Name}");
            var result = await consumerService.UpdateConsumer(requestModel);
            return new BaseResponse<int>() { ErrorCode = 0, ErrorMessage = "Success", Data = result };
        }

        // DELETE api/<ConsumerController>/5
        [HttpDelete("{id}")]
        public async Task<BaseResponse<int>> DeleteConsumer(int id)
        {
            _logger.LogInformation($"Delete Consumers {id}");
            var result = await consumerService.DeleteConsumer(id);
            return new BaseResponse<int>() { ErrorCode = 0, ErrorMessage = "Success", Data = result };
        }
    }
}
