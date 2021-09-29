using ASPNetCoreWebApi.Domain.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.ViewModels
{
    public class PromoCodesViewModel
    {
        public List<PromoCode> PromoCodeList { get; set; }
        public Pager Pager { get; set; }
    }
}
