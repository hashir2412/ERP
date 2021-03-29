using ERP.Domain.Interfaces;
using ERP.Model;
using ERP.Repository.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ERP.Domain
{
    public class ConsumerService : IConsumerService
    {
        private IConsumerRepository consumerRepository;
        private readonly ILogger<ConsumerService> _logger;

        public ConsumerService(IConsumerRepository repository, ILogger<ConsumerService> logger)
        {
            consumerRepository = repository;
            _logger = logger;
        }
        public async Task<IEnumerable<ConsumerSupplierResponseModel>> GetConsumers()
        {
            _logger.LogInformation("Consumers service - Get Consumers");
            var result = await consumerRepository.GetConsumers();
            _logger.LogInformation("Consumers service - Get Consumers successful");
            return result;
        }

        public async Task<int> AddConsumer(ConsumerSupplierResponseModel requestModel)
        {
            return await consumerRepository.AddConsumer(requestModel);
        }

        public async Task<int> DeleteConsumer(int consumerId)
        {
            return await consumerRepository.DeleteConsumer(consumerId);
        }


        public async Task<int> UpdateConsumer(ConsumerSupplierResponseModel requestModel)
        {
            return await consumerRepository.UpdateConsumer(requestModel);
        }
    }
}
