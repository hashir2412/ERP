﻿using ERP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Domain.Interfaces
{
    public interface ISalesService
    {
        Task<BaseResponse<int>> AddSale(AddSaleRequestModel requestModel);

        Task<IEnumerable<SalesResponse>> GetSales();


    }
}
