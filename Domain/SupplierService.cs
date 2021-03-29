using ERP.Domain.Interfaces;
using ERP.Model;
using ERP.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Domain
{
    public class SupplierService: ISupplierService
    {
        private ISupplierRepository supplierRepository;

        public SupplierService(ISupplierRepository repository)
        {
            supplierRepository = repository;
        }
        public async Task<int> AddSupplier(ConsumerSupplierResponseModel requestModel)
        {
            return await supplierRepository.AddSupplier(requestModel);
        }

        public async Task<int> DeleteSupplier(int supplierId)
        {
            return await supplierRepository.DeleteSupplier(supplierId);
        }

        public async Task<ConsumerSupplierResponseModel> GetSupplier(int id)
        {
            return await supplierRepository.GetSupplier(id);
        }

        public async Task<IEnumerable<ConsumerSupplierResponseModel>> GetSuppliers()
        {
            return await supplierRepository.GetSuppliers();
        }

        public async Task<int> UpdateSupplier(ConsumerSupplierResponseModel requestModel)
        {
            return await supplierRepository.UpdateSupplier(requestModel);
        }
    }
}
