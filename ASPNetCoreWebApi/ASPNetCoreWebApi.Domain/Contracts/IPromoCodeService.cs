using ASPNetCoreWebApi.Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface IPromoCodeService
    {
        Task<PromoCodesViewModel> GetAllItems(string searchText, int? pageSize, int? pageIndex, bool? getOnlyUsed);
        Task<int> Add(PromoCode newItem);
        Task<bool> Remove(int id);
        Task<bool> GeneratePromoCodes(int quantity, int discount);
        Task<PromoCode> GetByPromoCodeText(string promoCodeText);
    }
}
