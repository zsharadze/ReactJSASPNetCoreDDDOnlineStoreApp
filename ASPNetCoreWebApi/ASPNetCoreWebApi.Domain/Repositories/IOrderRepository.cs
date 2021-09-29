using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IOrderRepository
    {
        Task<int> CreateOrder(List<OrderItem> orderItems, string promoCode, decimal subTotal, string userId);
        Task<OrdersByUserViewModel> GetAllItemsForCurrentUser(string userId, int? pageSize, int? pageIndex);
        Task<OrdersViewModel> GetAllItems(int? pageSize, int? pageIndex);
        Task<int> ShipOrder(int id);
    }
}
