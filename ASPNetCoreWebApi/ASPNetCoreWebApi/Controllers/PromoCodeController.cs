using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.ViewModels;
using ASPNetCoreWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class PromoCodeController : Controller
    {
        private readonly IPromoCodeService _promoCodeService;

        public PromoCodeController(IPromoCodeService promoCodeService)
        {
            _promoCodeService = promoCodeService;
        }

        // GET: PromoCode/GetAll/?id=5
        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<PromoCodesViewModel> GetAll(string searchText = null, int? pageSize = 20, int? pageIndex = 1, bool? getOnlyUsed = false)
        {
            return await _promoCodeService.GetAllItems(searchText, pageSize, pageIndex, getOnlyUsed);
        }

        // GET: PromoCode/GetByPromoCodeText/?promoCodeText=...
        [HttpGet]
        public async Task<PromoCode> GetByPromoCodeText(string promoCodeText)
        {
            return await _promoCodeService.GetByPromoCodeText(promoCodeText);
        }

        // GET: PromoCode/GeneratePromoCodes/?quantity=10
        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<bool> GeneratePromoCodes(int quantity, int discount)
        {
            return await _promoCodeService.GeneratePromoCodes(quantity, discount);
        }

        // DELETE: PromoCode/Delete/?id=5
        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<bool> Delete(int id)
        {
            return await _promoCodeService.Remove(id);
        }
    }
}
