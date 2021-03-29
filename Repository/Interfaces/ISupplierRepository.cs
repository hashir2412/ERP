using ERP.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ERP.Repository.Interfaces
{
    public interface ISupplierRepository
    {
        Task<IEnumerable<ConsumerSupplierResponseModel>> GetSuppliers();

        Task<ConsumerSupplierResponseModel> GetSupplier(int id);

        Task<int> AddSupplier(ConsumerSupplierResponseModel requestModel);

        Task<int> UpdateSupplier(ConsumerSupplierResponseModel requestModel);

        Task<int> DeleteSupplier(int supplierId);
    }
}
