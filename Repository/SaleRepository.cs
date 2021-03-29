using AutoMapper;
using Dapper;
using ERP.Model;
using ERP.Model.DbModel;
using ERP.Repository.Interfaces;
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

        public SaleRepository(IMapper mapper)
        {
            _mapper = mapper;
        }
        public async Task<bool> AddSale(AddSaleRequestModel requestModel, double total, double totalWithoutTax)
        {

            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                try
                {
                    var id = $"INSERT INTO SalesOrder (ConsumerID,SaleDate,Total,TotalWithoutTax)" +
                    $" VALUES (@ConsumerID,@SaleDate,@Total,@TotalWithoutTax); SELECT CAST(SCOPE_IDENTITY() as int);";
                    var salesOrderResult = await connection.ExecuteScalarAsync<int>(id, new
                    {
                        ConsumerID = requestModel.ConsumerId,
                        SaleDate = DateTime.Now,
                        Total = total,
                        TotalWithoutTax = totalWithoutTax
                    });
                    foreach (var item in requestModel.Items)
                    {
                        var sql = $"INSERT INTO SalesCart (SalesOrderID,ItemID,Quantity) VALUES(@SalesOrderID, @ItemID,@Quantity); SELECT CAST(SCOPE_IDENTITY() as int);";
                        var SalesCartResult = await connection.ExecuteScalarAsync<int>(sql, new
                        {
                            SalesOrderID = salesOrderResult,
                            ItemID = item.Id,
                            Quantity = item.RequestedQuantity
                        });
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }


                return true;
            }
        }

        public async Task<IEnumerable<SalesResponse>> GetSales()
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {

                var sql = "select * from SalesCart inner join Inventory on Inventory.InventoryId = SalesCart.ItemID " +
                    "inner join SalesOrder on SalesCart.SalesOrderID = SalesOrder.SalesOrderId " +
                    "inner join Consumer on Consumer.ConsumerId = SalesOrder.ConsumerID";
                var SalessList = await connection.QueryAsync<SalesCartDbModel, InventoryDbModel, SalesOrderDbModel, ConsumerDbModel, SalesCartDbModel>(sql,
                    (cart, items, order, consumer) =>
                    {
                        items.RequestedQuantity = cart.Quantity;
                        cart.Items.Add(items);
                        cart.Order = order;
                        order.Consumer = consumer;
                        return cart;
                    }, splitOn: "InventoryId,SalesOrderID,ConsumerID"
                    );
                List<SalesResponse> result = new List<SalesResponse>();
                foreach (var i in SalessList)
                {
                    result.Add(new SalesResponse()
                    {
                        Cart = new SaleCartResponse()
                        {
                            Items = _mapper.Map<List<ItemResponseModel>>(i.Items),
                            SaleOrder = _mapper.Map<SaleOrderResponse>(i.Order),
                            Id = i.SalesCartId
                        }
                    });
                }
                return result;
            }
        }
    }
}

