using AutoMapper;
using Dapper;
using ERP.Model;
using ERP.Model.DbModel;
using ERP.Repository.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Repository
{
    public class ConsumerRepository : IConsumerRepository
    {
        private readonly IMapper _mapper;
        private ILogger<ConsumerRepository> _logger;

        public ConsumerRepository(IMapper mapper, ILogger<ConsumerRepository> logger)
        {
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<ConsumerSupplierResponseModel>> GetConsumers()
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                _logger.LogInformation("Consumers Repository - Get Consumers");
                var sql = "select * from Consumer";
                var suppliers = await connection.QueryAsync<ConsumerDbModel>(sql);
                _logger.LogInformation("Consumers Repository - Get Consumers Successful");
                return _mapper.Map<IEnumerable<ConsumerSupplierResponseModel>>(suppliers);
            }
        }

        public async Task<int> AddConsumer(ConsumerSupplierResponseModel requestModel)
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                _logger.LogInformation($"Consumer Repository - Adding Consumer {requestModel.Name}<>{requestModel.GSTIN}<>{requestModel.Address}<>{requestModel.Description}");
                var sql = $"INSERT INTO Consumer (Name,GSTIN,Address,Description) VALUES(@Name, @GSTIN, @Address, @Description)";
                var result = await connection.ExecuteAsync(sql, new { Name = requestModel.Name, GSTIN = requestModel.GSTIN, Address = requestModel.Address, Description = requestModel.Description });
                _logger.LogInformation($"Consumer Repository - Inserted into Consumer {requestModel.Name}<>{requestModel.GSTIN}<>{requestModel.Address}<>{requestModel.Description}");
                return result;
            }
        }

        public async Task<int> UpdateConsumer(ConsumerSupplierResponseModel requestModel)
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                _logger.LogInformation($"Consumer Repository - Updating Consumer {requestModel.Name}<>{requestModel.GSTIN}<>{requestModel.Address}<>{requestModel.Description}");
                var sql = $"Update Consumer set Name = {requestModel.Name}, GSTIN = {requestModel.GSTIN}, Address= {requestModel.Address},Description={requestModel.Description} Where Id = {requestModel.Id}";
                var result = await connection.ExecuteAsync(sql);
                _logger.LogInformation($"Consumer Repository - Updated Consumer {requestModel.Name}<>{requestModel.GSTIN}<>{requestModel.Address}<>{requestModel.Description}");
                return result;
            }
        }

        public async Task<int> DeleteConsumer(int consumerId)
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                _logger.LogInformation($"Consumer Repository - Deleting Consumer {consumerId}");
                var sql = $"Delete from Consumer where ConsumerId={consumerId}";
                var result = await connection.ExecuteAsync(sql);
                _logger.LogInformation($"Consumer Repository - Deleted Consumer {consumerId}");
                return result;
            }
        }
    }
}
