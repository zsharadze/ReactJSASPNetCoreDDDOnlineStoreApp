using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Models
{
    public class CreateOrderRequestModel
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
