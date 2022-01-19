using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Repositories
{
    public class PromoCodeRepository : IPromoCodeRepository
    {
        private readonly ApplicationDbContext _context;

        public PromoCodeRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> Add(PromoCode newItem)
        {
            newItem.CreatedDate = DateTime.Now;
            _context.PromoCodes.Add(newItem);
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> GeneratePromoCodes(int quantity, int discount)
        {
            for (int i = 0; i < quantity; i++)
            {
                PromoCode newPromoCode = new PromoCode();
                newPromoCode.CreatedDate = DateTime.Now;
                newPromoCode.Discount = discount;
                newPromoCode.PromoCodeText = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
                await _context.PromoCodes.AddAsync(newPromoCode);

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    return false;
                }
            }

            return true;
        }

        public async Task<PromoCodesViewModel> GetAllItems(string searchText, int? pageSize, int? pageIndex, bool? getOnlyUsed)
        {
            var result = new PromoCodesViewModel();
            result.PromoCodeList = new List<PromoCode>();

            var promoCodes = _context.PromoCodes.AsNoTracking().AsQueryable();
            string summaryTextAdd = "";

            if (searchText != null || getOnlyUsed.Value)
            {
                summaryTextAdd = $" (filtered from {promoCodes.Count()} total entries)";
            }

            promoCodes = promoCodes.OrderByDescending(x => x.Id);

            if (searchText != null)
            {
                promoCodes = promoCodes.Where(x => x.PromoCodeText == searchText);
            }

            if (getOnlyUsed.Value)
            {
                promoCodes = promoCodes.Where(x => x.IsUsed);
            }

            if (pageSize == null || pageIndex == null)
            {
                result.PromoCodeList = await promoCodes.ToListAsync();
                await AssignUsedOnOrderIdAndUserEmail(result.PromoCodeList);
                return result;
            }
            else if (pageSize.HasValue && pageIndex.HasValue)
            {
                int totalCount = await promoCodes.CountAsync();
                PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex.Value, pageSize.Value, summaryTextAdd);
                result.Pager = pagerHelper.GetPager;
                result.PromoCodeList = await promoCodes.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize).Take(pagerHelper.PageSize).ToListAsync();
                await AssignUsedOnOrderIdAndUserEmail(result.PromoCodeList);
                return result;
            }
            else
            {
                throw new Exception("pageSize or pageIndex parameter is null");
            }
        }

        public async Task<PromoCode> GetByPromoCodeText(string promoCodeText)
        {
            var promoCode = await _context.PromoCodes.SingleOrDefaultAsync(x => x.PromoCodeText == promoCodeText);
            if (promoCode != null && !promoCode.IsUsed)
                return promoCode;
            else
                return null;
        }

        public async Task<bool> Remove(int id)
        {
            PromoCode entity = await _context.PromoCodes.SingleOrDefaultAsync(a => a.Id == id);
            if (entity != null)
            {
                _context.PromoCodes.Remove(entity);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    throw;
                }
            }

            return true;
        }

        private async Task AssignUsedOnOrderIdAndUserEmail(List<PromoCode> promoCodes)
        {
            foreach (var item in promoCodes)
            {
                var usedOnOrder = await _context.Orders.AsNoTracking()
                    .Include(x => x.User)
                    .SingleOrDefaultAsync(x => x.PromoCodeId == item.Id);
                if (usedOnOrder != null)
                {
                    item.UsedOnOrderId = usedOnOrder.Id;
                    item.UsedByUserEmail = usedOnOrder.User.Email;
                }
            }
        }
    }
}
