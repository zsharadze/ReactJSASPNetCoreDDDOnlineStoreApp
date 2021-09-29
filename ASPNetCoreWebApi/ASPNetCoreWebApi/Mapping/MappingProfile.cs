using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.ViewModels;
using ASPNetCoreWebApi.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ASPNetCoreWebApi.Infrastructure;

namespace ASPNetCoreWebApi.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateOrderRequestModel, OrderItem>();
            CreateMap<Order, OrdersByUser>()
                .ForMember(destination => destination.CreatedDate, opts => opts.MapFrom(source => source.CreatedDate.ToString("dd/MM/yyyy")))
                .ForMember(destination => destination.IsShipped, opts => opts.MapFrom(source => source.IsShipped))
                .ForMember(destination => destination.Subtotal, opts => opts.MapFrom(source => source.Subtotal))
                .ForMember(destination => destination.SubtotalWithPromo, opts => opts.MapFrom(source => source.SubtotalWithPromo))
                .IgnoreAllUnmapped();

            CreateMap<OrderItem, OrderItemViewModel>()
               .ForMember(destination => destination.Id, opts => opts.MapFrom(source => source.Id))
               .ForMember(destination => destination.ProductId, opts => opts.MapFrom(source => source.ProductId))
               .ForMember(destination => destination.Quantity, opts => opts.MapFrom(source => source.Quantity))
               .ForMember(destination => destination.Price, opts => opts.MapFrom(source => source.Product.Price))
               .ForMember(destination => destination.ProductImageSrc, opts => opts.MapFrom(source => source.Product.ImageSrc))
               .ForMember(destination => destination.Name, opts => opts.MapFrom(source => source.Product.Name))
               .ForMember(destination => destination.Description, opts => opts.MapFrom(source => source.Product.Description));
        }
    }
}
