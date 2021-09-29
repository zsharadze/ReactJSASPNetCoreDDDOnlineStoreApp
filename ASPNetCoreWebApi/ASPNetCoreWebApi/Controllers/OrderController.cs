using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.ViewModels;
using ASPNetCoreWebApi.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]
    public class OrderController : Controller
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        public OrderController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        public string CurrentUserId
        {
            get
            {
                return User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
        }

        // POST: Order/CreateOrder
        [HttpPost]
        [Authorize]
        public async Task<int> CreateOrder([FromBody] List<CreateOrderRequestModel> orderItems, string promoCode)
        {
            var orderItemObjects = _mapper.Map<List<OrderItem>>(orderItems);
            return await _orderService.CreateOrder(orderItemObjects, promoCode, CurrentUserId);
        }

        // GET: Order/GetAllForCurrentUser
        [HttpGet]
        [Authorize]
        public async Task<OrdersByUserViewModel> GetAllForCurrentUser(int? pageSize = 20, int? pageIndex = 1)
        {
            if (pageIndex == null)
            {
                pageIndex = 1;
            }
            var orders = await _orderService.GetAllItemsForCurrentUser(CurrentUserId, pageSize, pageIndex);
            return orders;
        }

        // GET: Order/GetAll
        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<OrdersViewModel> GetAll(int? pageSize = 20, int? pageIndex = 1)
        {
            if (pageIndex == null)
            {
                pageIndex = 1;
            }
            var orders = await _orderService.GetAllItems(pageSize, pageIndex);
            return orders;
        }

        // POST: Order/ShipOrder
        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<int> ShipOrder(int id)
        {
            return await _orderService.ShipOrder(id);
        }
    }
}
