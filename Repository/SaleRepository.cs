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
    public class SaleRepository : ISaleRepository
    {
        private readonly IMapper _mapper;
        private ILogger<SaleRepository> _logger;
        private IConfiguration _configuration;
        public SaleRepository(IMapper mapper, ILogger<SaleRepository> logger, IConfiguration configuration)
        {
            _mapper = mapper;
            _logger = logger;
            _configuration = configuration;
        }
        public async Task<int> AddSale(AddSaleRequestModel requestModel, double total, double totalWithoutTax)
        {

            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                _logger.LogInformation("Sale Repository - Add Sale");
                var id = $"INSERT INTO SalesOrder (ConsumerID,SaleDate,Total,TotalWithoutTax)" +
                $" VALUES (@ConsumerID,@SaleDate,@Total,@TotalWithoutTax); SELECT CAST(SCOPE_IDENTITY() as int);";
                var salesOrderResult = await connection.ExecuteScalarAsync<int>(id, new
                {
                    ConsumerID = requestModel.ConsumerId,
                    SaleDate = DateTime.Now,
                    Total = total,
                    TotalWithoutTax = totalWithoutTax
                });
                _logger.LogInformation($"Sale Repository - Inserted into Sale Order, Supplier - {requestModel.ConsumerId}, Date {DateTime.Now}" +
                    $"Total {total} TotalWithoutTax {totalWithoutTax}");
                int result = 0;
                foreach (var item in requestModel.Items)
                {
                    var sql = $"INSERT INTO SalesCart (SalesOrderID,ItemID,Quantity) VALUES(@SalesOrderID, @ItemID,@Quantity); SELECT CAST(SCOPE_IDENTITY() as int);";
                    var SalesCartResult = await connection.ExecuteScalarAsync<int>(sql, new
                    {
                        SalesOrderID = salesOrderResult,
                        ItemID = item.Id,
                        Quantity = item.RequestedQuantity
                    });
                    result = SalesCartResult;
                }
                _logger.LogInformation("Sale Repository - Inserted into Sale Cart");
                return result;
            }
        }

        public async Task<IEnumerable<SalesResponse>> GetSales()
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                _logger.LogInformation("Sale Repository - Get Sales");
                var sql = "select * from SalesCart inner join Inventory on Inventory.InventoryId = SalesCart.ItemID " +
                    "inner join SalesOrder on SalesCart.SalesOrderID = SalesOrder.SalesOrderId " +
                    "inner join Consumer on Consumer.ConsumerId = SalesOrder.ConsumerID";
                var SalesCartList = await connection.QueryAsync<SalesCartDbModel, InventoryDbModel, SalesOrderDbModel, ConsumerDbModel, SalesCartDbModel>(sql,
                    (cart, item, order, consumer) =>
                    {
                        item.RequestedQuantity = cart.Quantity;
                        cart.Item = item;
                        cart.Order = order;
                        order.Consumer = consumer;
                        return cart;
                    }, splitOn: "InventoryId,SalesOrderID,ConsumerID"
                    );
                List<SalesResponse> result = new List<SalesResponse>();

                var salesCartGroupedList = SalesCartList.GroupBy(u => u.Order.SalesOrderId)
                                      .Select(grp => new { Id = grp.Key, Items = grp.ToList() })
                                      .ToList();
                foreach (var i in salesCartGroupedList)
                {
                    var cart = SalesCartList.FirstOrDefault(res => res.Order.SalesOrderId == i.Id);
                    SaleCartResponse finalCart = new SaleCartResponse();
                    finalCart.Id = i.Id;
                    finalCart.Items = new List<ItemResponseModel>();
                    i.Items.ForEach(item =>
                    {
                        finalCart.Items.Add(_mapper.Map<ItemResponseModel>(item.Item));
                    });
                    finalCart.SaleOrder = _mapper.Map<SaleOrderResponse>(cart.Order);
                    result.Add(new SalesResponse()
                    {
                        Cart = finalCart
                    });
                }
                _logger.LogInformation("Sale Repository - Get Sales Successful");
                return result;
            }
        }
    }
}

