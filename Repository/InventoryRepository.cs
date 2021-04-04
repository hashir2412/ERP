using AutoMapper;
using Dapper;
using ERP.Domain;
using ERP.Model;
using ERP.Model.DbModel;
using ERP.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace ERP.Repository
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly IMapper _mapper;
        private readonly ILogger<InventoryRepository> _logger;
        private IConfiguration _configuration;

        public InventoryRepository(IMapper mapper, ILogger<InventoryRepository> logger, IConfiguration configuration)
        {
            _mapper = mapper;
            _logger = logger;
            _configuration = configuration;
        }
        public async Task<List<bool>> AddItems(List<ItemRequestModel> items)
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                List<bool> results = new List<bool>();
                foreach (var item in items)
                {
                    _logger.LogInformation("Inventory Repository - Add Items");
                    _logger.LogInformation($"{item.Name} {item.QuantityName} {item.QuantityValue}, previous Quantity- {item.Quantity}," +
                        $" requested quantity- {item.RequestedQuantity}");
                    var res = $"{item.QuantityName}{InventoryService.SPLITSENTENCE}{item.QuantityValue}{InventoryService.SPLITSENTENCE}{item.Name}";
                    var sql = $"INSERT INTO Inventory (Name, Description, Quantity, PriceWithoutTax, GST, PriceWithTax,RawName)" +
                        $" VALUES(@Name,@Description,@Quantity,@PriceWithoutTax,@GST,@PriceWithTax,@RawName; ";
                    var result = await connection.ExecuteAsync(sql, new
                    {
                        Name = item.Name,
                        Description = item.Description,
                        Quantity = item.Quantity,
                        PriceWithoutTax = item.PriceWithoutTax,
                        GST = item.GST,
                        PriceWithTax = item.PriceWithTax,
                        RawName = res
                    });
                    results.Add(result == 1);
                }
                _logger.LogInformation("Inventory Repository - Add Items Successful");
                return results;
            }
        }

        public async Task<IEnumerable<ItemResponseModel>> GetItems()
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                _logger.LogInformation("Inventory Repository - Get Items");
                var sql = "select * from Inventory";
                var items = await connection.QueryAsync<InventoryDbModel>(sql);
                _logger.LogInformation("Inventory Repository - Get Items Successful");
                return _mapper.Map<IEnumerable<ItemResponseModel>>(items);
            }
        }

        public async Task<List<bool>> UpdateItemsQuantity(List<ItemRequestModel> items, bool isSale)
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                _logger.LogInformation("Inventory Repository - Update Items");
                List<bool> results = new List<bool>();
                foreach (var item in items)
                {
                    _logger.LogInformation($"Sale {isSale}, {item.Name} {item.QuantityName} {item.QuantityValue}, previous Quantity- {item.Quantity}," +
                        $" requested quantity- {item.RequestedQuantity}");
                    char operatorToBeApplied = isSale ? '+' : '-';
                    if (!isSale)
                    {
                        item.Quantity += item.RequestedQuantity;
                    }
                    else
                    {
                        item.Quantity -= item.RequestedQuantity;
                    }
                    var sql = $"Update Inventory set Quantity = @Quantity where InventoryId=@Id";
                    var result = await connection.ExecuteAsync(sql, new { Quantity = item.Quantity, Id = item.Id });
                    results.Add(result == 1);
                }
                _logger.LogInformation("Inventory Repository - Update Items Successful");
                return results;

            }
        }
    }
}
