using Dapper;
using ERP.Domain.Interfaces;
using ERP.Dto;
using ERP.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Controllers
{
    [Route("api/suppliers")]
    public class SupplierController : Controller
    {
        private readonly ISupplierService supplierService;
        private readonly ILogger<SupplierController> _logger;

        public SupplierController(ISupplierService service, ILogger<SupplierController> logger)
        {
            supplierService = service;
            _logger = logger;
        }
        [HttpGet]
        public async Task<BaseResponse<IEnumerable<ConsumerSupplierResponseModel>>> GetSuppliers()
        {
            _logger.LogInformation("Get Suppliers");
            var result = await supplierService.GetSuppliers();
            return new BaseResponse<IEnumerable<ConsumerSupplierResponseModel>> () { ErrorCode = 0, ErrorMessage = "Success", Data = result };
        }

        //[HttpGet("{id}")]
        //public async Task<ConsumerSupplierResponseModel> Get(int id)
        //{
        //    return await supplierService.GetSupplier(id);
        //}


        [HttpPost]
        public async Task<BaseResponse<int>> AddSupplier([FromBody]ConsumerSupplierResponseModel requestModel)
        {
            _logger.LogInformation($"Add Supplier {requestModel.Name} {requestModel.GSTIN}");
            var result = await supplierService.AddSupplier(requestModel);
            return new BaseResponse<int>() { ErrorCode = 0, ErrorMessage = "Success", Data = result };
        }

        [HttpPut]
        public async Task<BaseResponse<int>> UpdateSupplier(ConsumerSupplierResponseModel requestModel)
        {
            _logger.LogInformation($"Update Supplier {requestModel.Name} {requestModel.GSTIN}");
            var result = await supplierService.UpdateSupplier(requestModel);
            return new BaseResponse<int>() { ErrorCode = 0, ErrorMessage = "Success", Data = result };
        }

        [HttpDelete]
        public async Task<int> DeleteSupplier(int supplierId)
        {
            _logger.LogInformation($"Delete Supplier {supplierId}");
            return await supplierService.DeleteSupplier(supplierId);
        }
    }
}
