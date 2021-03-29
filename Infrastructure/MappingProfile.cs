using AutoMapper;
using ERP.Model;
using ERP.Model.DbModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Infrastructure
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<ConsumerDbModel, ConsumerSupplierResponseModel>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ConsumerId));
            CreateMap<ConsumerSupplierResponseModel, ConsumerDbModel>().ForMember(dest => dest.ConsumerId, opt => opt.MapFrom(src => src.Id));
            CreateMap<SupplierDbModel, ConsumerSupplierResponseModel>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.SupplierId));
            CreateMap<ConsumerSupplierResponseModel, SupplierDbModel>().ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.Id));

            CreateMap<InventoryDbModel, ItemResponseModel>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.InventoryId));
            CreateMap<ItemResponseModel, InventoryDbModel>().ForMember(dest => dest.InventoryId, opt => opt.MapFrom(src => src.Id));
            CreateMap<PurchaseCartDbModel, PurchaseCartResponse>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.PurchaseCartId));
            CreateMap<PurchaseCartResponse, PurchaseCartDbModel>().ForMember(dest => dest.PurchaseCartId, opt => opt.MapFrom(src => src.Id));
            CreateMap<PurchaseOrderDbModel, PurchaseOrderResponse>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.PurchaseOrderId));
            CreateMap<PurchaseOrderResponse, PurchaseOrderDbModel>().ForMember(dest => dest.PurchaseOrderId, opt => opt.MapFrom(src => src.Id));

            CreateMap<SalesCartDbModel, SaleCartResponse>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.SalesCartId));
            CreateMap<SaleCartResponse, SalesCartDbModel>().ForMember(dest => dest.SalesCartId, opt => opt.MapFrom(src => src.Id));
            CreateMap<SalesOrderDbModel, SaleOrderResponse>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.SalesOrderId));
            CreateMap<SaleOrderResponse, SalesOrderDbModel>().ForMember(dest => dest.SalesOrderId, opt => opt.MapFrom(src => src.Id));
        }
    }

}
