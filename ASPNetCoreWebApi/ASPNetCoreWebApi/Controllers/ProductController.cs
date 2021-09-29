using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.ViewModels;
using ASPNetCoreWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        public string CurrentUserId
        {
            get
            {
                return User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
        }


        // GET: Product/GetAll
        [HttpGet]
        public async Task<ProductsViewModel> GetAll(int? categoryId, string searchText = null, int? pageSize = 20, int? pageIndex = 1)
        {
            if (pageIndex == null)
            {
                pageIndex = 1;
            }

            var productViewModel = await _productService.GetAllItems(categoryId, searchText, pageSize, pageIndex);

            return productViewModel;
        }

        // GET: Product/Details/?id=5
        [HttpGet]
        public async Task<Product> Details(int id)
        {
            return await _productService.GetById(id);
        }

        // POST: Product/Create
        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<int> Create([FromBody] Product product)
        {
            return await _productService.Add(product);
        }

        // PUT: Product/Edit
        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<Product> Edit([FromBody] Product product)
        {
            return await _productService.Update(product);
        }

        // DELETE: Product/Delete/?id=5
        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<bool> Delete(int id)
        {
            return await _productService.Remove(id);
        }
    }
}
