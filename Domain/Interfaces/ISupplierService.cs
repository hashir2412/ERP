using ERP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Domain.Interfaces
{
    public interface ISupplierService
    {
        Task<IEnumerable<ConsumerSupplierResponseModel>> GetSuppliers();

        Task<ConsumerSupplierResponseModel> GetSupplier(int id);

        Task<int> AddSupplier(ConsumerSupplierResponseModel requestModel);

        Task<int> UpdateSupplier(ConsumerSupplierResponseModel requestModel);

        Task<int> DeleteSupplier(int supplierId);
    }
}
