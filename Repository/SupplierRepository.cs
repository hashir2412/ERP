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
    public class SupplierRepository : ISupplierRepository
    {
        private readonly IMapper _mapper;
        public SupplierRepository(IMapper mapper)
        {
            _mapper = mapper;
        }

        public async Task<IEnumerable<ConsumerSupplierResponseModel>> GetSuppliers()
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                var sql = "select * from Supplier";
                var suppliers = await connection.QueryAsync<SupplierDbModel>(sql);

                return _mapper.Map<IEnumerable<ConsumerSupplierResponseModel>>(suppliers);
            }
        }

        public async Task<ConsumerSupplierResponseModel> Get(int id)
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                var sql = "select * from Supplier";
                var suppliers = await connection.QueryAsync<ConsumerSupplierResponseModel>(sql);

                return suppliers.FirstOrDefault();
            }
        }


        public async Task<int> AddSupplier(ConsumerSupplierResponseModel requestModel)
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                var sql = $"INSERT INTO Supplier (Name,GSTIN,Address,Description) VALUES(@Name, @GSTIN, @Address, @Description)";
                var result = await connection.ExecuteAsync(sql, new { Name= requestModel.Name, GSTIN= requestModel.GSTIN, Address= requestModel.Address, Description= requestModel.Description });
                return result;
            }
        }

        public async Task<int> UpdateSupplier(ConsumerSupplierResponseModel requestModel)
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                var sql = $"Update Supplier set Name = {requestModel.Name}, GSTIN = {requestModel.GSTIN}, Address= {requestModel.Address},Description={requestModel.Description} Where Id = {requestModel.Id}";
                var result = await connection.ExecuteAsync(sql);
                return result;
            }
        }

        public async Task<int> DeleteSupplier(int supplierId)
        {
            using (var connection = new SqlConnection(TestDemo.CONNECTIONSTRING))
            {
                var sql = $"Delete from Supplier where SupplierId={supplierId}";
                var result = await connection.ExecuteAsync(sql);
                return result;
            }
        }

        public Task<ConsumerSupplierResponseModel> GetSupplier(int id)
        {
            throw new NotImplementedException();
        }
    }
}
