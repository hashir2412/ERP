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
    public class PurchaseRepository : IPurchaseRepository
    {
        private readonly IMapper _mapper;
        private readonly ILogger<PurchaseRepository> _logger;
        private IConfiguration _configuration;

        public PurchaseRepository(IMapper mapper, ILogger<PurchaseRepository> logger,IConfiguration configuration)
        {
            _mapper = mapper;
            _logger = logger;
            _configuration = configuration;
        }
        public async Task<int> AddPurchase(AddPurchaseRequestModel requestModel, double total, double totalWithoutTax)
        {
            using (var connection = new SqlConnection(_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value))
            {
                _logger.LogInformation("Purchase Repository - Add Purchase");
                var id = $"INSERT INTO PurchaseOrder (SupplierID,PurchaseDate,Total,TotalWithoutTax)" +
                $" VALUES (@SupplierID,@PurchaseDate,@Total,@TotalWithoutTax); SELECT CAST(SCOPE_IDENTITY() as int);";
                var purchaseOrderResultId = await connection.ExecuteScalarAsync<int>(id, new
                {
                    SupplierID = requestModel.SupplierId,
                    PurchaseDate = DateTime.Now,
                    Total = total,
                    TotalWithoutTax = totalWithoutTax
                });
                _logger.LogInformation($"Purchase Repository - Inserted into Purchase Order, Supplier - {requestModel.SupplierId}, Date {DateTime.Now}" +
                    $"Total {total} TotalWithoutTax {totalWithoutTax}");
                int result = 0;
                foreach (var item in requestModel.Items)
                {
                    var sql = $"INSERT INTO PurchaseCart (PurchaseOrderID,ItemID,Quantity) VALUES(@PurchaseOrderID, @ItemID,@Quantity); SELECT CAST(SCOPE_IDENTITY() as int);";
                    var purchaseCartResult = await connection.ExecuteScalarAsync<int>(sql, new
                    {
                        PurchaseOrderID = purchaseOrderResultId,
                        ItemID = item.Id,
                        Quantity = item.RequestedQuantity
                    });
                    result = purchaseCartResult;
                }
                _logger.LogInformation("Purchase Repository - Inserted into Purchase Cart");

                return result;
            }
        }

        public async Task<IEnumerable<PurchasesResponse>> GetPurchases()
        {
            string someValue = _configuration.GetSection(TestDemo.CONNECTIONSTRING).Value;
            _logger.LogInformation($"connection string value {_configuration.GetSection(TestDemo.CONNECTIONSTRING).Value}");
            using (var connection = new SqlConnection(someValue))
            {
                _logger.LogInformation("Purchase Repository - Get purchases");
                var sql = "select * from PurchaseCart inner join Inventory on Inventory.InventoryId = PurchaseCart.ItemID " +
                    "inner join PurchaseOrder on PurchaseCart.PurchaseOrderID = PurchaseOrder.PurchaseOrderId " +
                    "inner join Supplier on Supplier.SupplierId = PurchaseOrder.SupplierID";
                var purchaseCartList = await connection.QueryAsync<PurchaseCartDbModel, InventoryDbModel, PurchaseOrderDbModel, SupplierDbModel, PurchaseCartDbModel>(sql,
                    (cart, item, order, supplier) =>
                    {
                        item.RequestedQuantity = cart.Quantity;
                        cart.Item = item;
                        cart.Order = order;
                        order.Supplier = supplier;
                        return cart;
                    }, splitOn: "InventoryId,PurchaseOrderID,SupplierID"
                    );
                List<PurchasesResponse> result = new List<PurchasesResponse>();

                var purchaseCartGroupedList = purchaseCartList.GroupBy(u => u.Order.PurchaseOrderId)
                                      .Select(grp => new { Id = grp.Key, Items = grp.ToList() })
                                      .ToList();
                foreach (var i in purchaseCartGroupedList)
                {
                    var cart = purchaseCartList.FirstOrDefault(res => res.Order.PurchaseOrderId == i.Id);
                    PurchaseCartResponse finalCart = new PurchaseCartResponse();
                    finalCart.Id = i.Id;
                    finalCart.Items = new List<ItemResponseModel>();
                    i.Items.ForEach(item =>
                    {
                        finalCart.Items.Add(_mapper.Map<ItemResponseModel>(item.Item));
                    });
                    finalCart.PurchaseOrder = _mapper.Map<PurchaseOrderResponse>(cart.Order);
                    result.Add(new PurchasesResponse()
                    {
                        Cart = finalCart
                    });
                }
                _logger.LogInformation("Purchase Repository - Get Purchases Successful");
                return result;
            }

        }
    }
}
