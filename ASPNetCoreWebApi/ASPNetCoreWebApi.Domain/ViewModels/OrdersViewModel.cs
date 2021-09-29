using ASPNetCoreWebApi.Domain.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.ViewModels
{
    public class OrdersViewModel
    {
        public List<Order> OrderList { get; set; }
        public Pager Pager { get; set; }
    }
}
