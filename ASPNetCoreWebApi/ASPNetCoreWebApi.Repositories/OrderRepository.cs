using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public OrderRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper;
        }

        public async Task<int> CreateOrder(List<OrderItem> orderItems, string promoCode, decimal subTotal, string userId)
        {
            Order order = new Order();
            order.CreatedDate = DateTime.Now;
            order.UserId = userId;
            order.Subtotal = subTotal;
            if (!string.IsNullOrEmpty(promoCode))
            {
                var promoCodeEntity = _context.PromoCodes.SingleOrDefault(x => x.PromoCodeText == promoCode);                
                if (promoCodeEntity != null)
                {
                    if (promoCodeEntity.IsUsed)
                    {
                        return -100;
                    }
                    order.PromoCodeId = promoCodeEntity.Id;
                    var diff = order.Subtotal - promoCodeEntity.Discount;
                    order.SubtotalWithPromo = diff > 0 ? diff : 0;
                    promoCodeEntity.IsUsed = true;
                    _context.PromoCodes.Update(promoCodeEntity);
                }
            }

            _context.Orders.Add(order);
            try
            {
                await _context.SaveChangesAsync();

                foreach (var item in orderItems)
                {
                    item.OrderId = order.Id;
                    _context.OrderItems.Add(item);
                }
                return await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<OrdersByUserViewModel> GetAllItemsForCurrentUser(string userId, int? pageSize, int? pageIndex)
        {
            OrdersByUserViewModel result = new OrdersByUserViewModel();
            var user = await _context.Users
                .AsNoTracking()
                .Include(x => x.Orders)
                .ThenInclude(x => x.OrderItems)
                .ThenInclude(x => x.Product)
                .SingleOrDefaultAsync(x => x.Id == userId);

            if (user == null)
            {
                throw new Exception("user not found");
            }

            if (pageSize == null || pageIndex == null)
            {
                var orders = user.Orders;
                var orderList = new List<OrdersByUser>();

                foreach (var item in orders)
                {
                    var order = _mapper.Map<OrdersByUser>(item);
                    if (item.PromoCodeId != null)
                    {
                        var promoCode = await _context.PromoCodes.FindAsync(item.PromoCodeId);
                        order.PromoCodeUsed = promoCode.PromoCodeText;
                    }
                    orderList.Add(order);
                }
            }
            else if (pageSize.HasValue && pageIndex.HasValue)
            {
                int totalCount = await _context.Orders.AsNoTracking().Where(x => x.UserId == userId).CountAsync();
                PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex.Value, pageSize.Value, "");
                result.Pager = pagerHelper.GetPager;

                var orders = user.Orders.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize)
                    .Take(pagerHelper.PageSize);
                var orderList = new List<OrdersByUser>();

                foreach (var item in orders)
                {
                    var order = _mapper.Map<OrdersByUser>(item);
                    if (item.PromoCodeId != null)
                    {
                        var promoCode = await _context.PromoCodes.FindAsync(item.PromoCodeId);
                        order.PromoCodeUsed = promoCode.PromoCodeText;
                    }
                    orderList.Add(order);
                }
                result.OrdersByUserList = orderList;
            }

            return result;
        }

        public async Task<OrdersViewModel> GetAllItems(int? pageSize, int? pageIndex)
        {
            OrdersViewModel result = new OrdersViewModel();
            if (pageSize == null || pageIndex == null)
            {
                result.OrderList = await _context.Orders
                    .AsNoTracking()
                    .Include(x => x.PromoCode)
                    .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                    .ToListAsync();
                await AssignUserEmail(result.OrderList);
                return result;
            }
            else if (pageSize.HasValue && pageIndex.HasValue)
            {
                int totalCount = await _context.Orders.AsNoTracking().CountAsync();
                PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex.Value, pageSize.Value, "");
                result.Pager = pagerHelper.GetPager;
                result.OrderList = await _context.Orders.AsNoTracking()
                    .Include(x => x.PromoCode)
                    .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                    .Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize)
                    .Take(pagerHelper.PageSize)
                    .ToListAsync();
                await AssignUserEmail(result.OrderList);
                return result;
            }
            else
            {
                throw new Exception("pageSize or pageIndex parameter is null");
            }
        }

        public async Task<int> ShipOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                throw new Exception("Order with id: " + id + " not found.");
            }

            order.IsShipped = true;

            return await _context.SaveChangesAsync();
        }

        private async Task AssignUserEmail(List<Order> orders)
        {
            foreach (var item in orders)
            {
                var user = await _context.Users.FindAsync(item.UserId);
                item.UserEmail = user.Email;
            }
        }
    }
}
