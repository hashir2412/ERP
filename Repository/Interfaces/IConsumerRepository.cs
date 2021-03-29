using ERP.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ERP.Repository.Interfaces
{
    public interface IConsumerRepository
    {
        Task<IEnumerable<ConsumerSupplierResponseModel>> GetConsumers();

        Task<int> AddConsumer(ConsumerSupplierResponseModel requestModel);

        Task<int> UpdateConsumer(ConsumerSupplierResponseModel requestModel);

        Task<int> DeleteConsumer(int consumerId);

    }
}
