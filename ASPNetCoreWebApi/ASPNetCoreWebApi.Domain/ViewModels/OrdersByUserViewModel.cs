using ASPNetCoreWebApi.Domain.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.ViewModels
{
    public class OrdersByUserViewModel
    {
        public List<OrdersByUser> OrdersByUserList { get; set; }
        public Pager Pager { get; set; }
    }

    public class OrdersByUser
    {
        public int Id { get; set; }
        public string CreatedDate { get; set; }
        public bool IsShipped { get; set; }
        public decimal Subtotal { get; set; }
        public decimal? SubtotalWithPromo { get; set; }
        public string PromoCodeUsed { get; set; }
        public List<OrderItemViewModel> OrderItems { get; set; }
    }

    public class OrderItemViewModel
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ProductImageSrc { get; set; }
    }
}
