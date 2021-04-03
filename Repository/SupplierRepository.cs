using AutoMapper;
using Dapper;
using ERP.Model;
using ERP.Model.DbModel;
using ERP.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Repository
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly IMapper _mapper;
        private ILogger<SupplierRepository> _logger;
        private IConfiguration _configuration;


        public SupplierRepository(IMapper mapper, ILogger<SupplierRepository> logger, IConfiguration configuration)
        {
            _mapper = mapper;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<IEnumerable<ConsumerSupplierResponseModel>> GetSuppliers()
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                _logger.LogInformation("Suppliers Repository - Get Consumers");

                var sql = "select * from Supplier";
                var suppliers = await connection.QueryAsync<SupplierDbModel>(sql);
                _logger.LogInformation("Suppliers Repository - Get Consumers Successful");

                return _mapper.Map<IEnumerable<ConsumerSupplierResponseModel>>(suppliers);
            }
        }

        public async Task<ConsumerSupplierResponseModel> Get(int id)
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                var sql = "select * from Supplier";
                var suppliers = await connection.QueryAsync<ConsumerSupplierResponseModel>(sql);

                return suppliers.FirstOrDefault();
            }
        }


        public async Task<int> AddSupplier(ConsumerSupplierResponseModel requestModel)
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                _logger.LogInformation($"Supplier Repository - Adding Consumer {requestModel.Name}<>{requestModel.GSTIN}<>{requestModel.Address}<>{requestModel.Description}");
                var sql = $"INSERT INTO Supplier (Name,GSTIN,Address,Description) VALUES(@Name, @GSTIN, @Address, @Description)";
                var result = await connection.ExecuteAsync(sql, new { Name= requestModel.Name, GSTIN= requestModel.GSTIN, Address= requestModel.Address, Description= requestModel.Description });
                _logger.LogInformation($"Supplier Repository - Inserted into Consumer {requestModel.Name}<>{requestModel.GSTIN}<>{requestModel.Address}<>{requestModel.Description}");
                return result;
            }
        }

        public async Task<int> UpdateSupplier(ConsumerSupplierResponseModel requestModel)
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                _logger.LogInformation($"Supplier Repository - Updating Consumer {requestModel.Name}<>{requestModel.GSTIN}<>{requestModel.Address}<>{requestModel.Description}");
                var sql = $"Update Supplier set Name = {requestModel.Name}, GSTIN = {requestModel.GSTIN}, Address= {requestModel.Address},Description={requestModel.Description} Where Id = {requestModel.Id}";
                var result = await connection.ExecuteAsync(sql);
                _logger.LogInformation($"Supplier Repository - Updated Consumer {requestModel.Name}<>{requestModel.GSTIN}<>{requestModel.Address}<>{requestModel.Description}");
                return result;
            }
        }

        public async Task<int> DeleteSupplier(int supplierId)
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                _logger.LogInformation($"Supplier Repository - Deleting Consumer {supplierId}");
                var sql = $"Delete from Supplier where SupplierId={supplierId}";
                var result = await connection.ExecuteAsync(sql);
                _logger.LogInformation($"Supplier Repository - Deleted Consumer {supplierId}");

                return result;
            }
        }

        public Task<ConsumerSupplierResponseModel> GetSupplier(int id)
        {
            throw new NotImplementedException();
        }
    }
}
