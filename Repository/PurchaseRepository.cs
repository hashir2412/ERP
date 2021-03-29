using AutoMapper;
using Dapper;
using ERP.Model;
using ERP.Model.DbModel;
using ERP.Repository.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace ERP.Repository
{
    public class PurchaseRepository : IPurchaseRepository
    {
        private readonly IMapper _mapper;
        private readonly ILogger<PurchaseRepository> _logger;

        public PurchaseRepository(IMapper mapper, ILogger<PurchaseRepository> logger)
        {
            _mapper = mapper;
            _logger = logger;
        }
        public async Task<int> AddPurchase(AddPurchaseRequestModel requestModel, double total, double totalWithoutTax)
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
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
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                _logger.LogInformation("Purchase Repository - Get purchases");
                var sql = "select * from PurchaseCart inner join Inventory on Inventory.InventoryId = PurchaseCart.ItemID " +
                    "inner join PurchaseOrder on PurchaseCart.PurchaseOrderID = PurchaseOrder.PurchaseOrderId " +
                    "inner join Supplier on Supplier.SupplierId = PurchaseOrder.SupplierID";
                var purchasesList = await connection.QueryAsync<PurchaseCartDbModel, InventoryDbModel, PurchaseOrderDbModel, SupplierDbModel, PurchaseCartDbModel>(sql,
                    (cart, items, order, supplier) =>
                    {
                        items.RequestedQuantity = cart.Quantity;
                        cart.Items.Add(items);
                        cart.Order = order;
                        order.Supplier = supplier;
                        return cart;
                    }, splitOn: "InventoryId,PurchaseOrderID,SupplierID"
                    );
                _logger.LogInformation("Purchase Repository - Get Purchases Successful");
                List<PurchasesResponse> result = new List<PurchasesResponse>();
                foreach (var i in purchasesList)
                {
                    result.Add(new PurchasesResponse()
                    {
                        Cart = new PurchaseCartResponse()
                        {
                            Items = _mapper.Map<List<ItemResponseModel>>(i.Items),
                            PurchaseOrder = _mapper.Map<PurchaseOrderResponse>(i.Order),
                            Id = i.PurchaseCartId
                        }
                    });
                }
                return result;
            }

        }
    }
}
