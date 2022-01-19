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
using System;
using ASPNetCoreWebApi.Infrastructure;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;
        private readonly NudeImageDetectorHelper _nudeImageDetectorHelper;
        private readonly FileValidator _fileValidator;
        public ProductController(IProductService productService, NudeImageDetectorHelper nudeImageDetectorHelper, FileValidator fileValidator)
        {
            _productService = productService;
            _nudeImageDetectorHelper = nudeImageDetectorHelper;
            _fileValidator = fileValidator;
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
            byte[] imageBytes = Convert.FromBase64String(product.ImageSrc);
            if (!_fileValidator.ValidSize(imageBytes.Length))
            {
                return -500;
            }

            var nudityId = await _nudeImageDetectorHelper.IsNudeImage(imageBytes);
            if (nudityId != 0)
            {
                return nudityId;
            }
            await _productService.Add(product);
            return 0;
        }

        // PUT: Product/Edit
        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<int> Edit([FromBody] Product product)
        {
            byte[] imageBytes = Convert.FromBase64String(product.ImageSrc);
            if (!_fileValidator.ValidSize(imageBytes.Length))
            {
                return -500;
            }
            var nudityId = await _nudeImageDetectorHelper.IsNudeImage(imageBytes);
            if (nudityId != 0)
            {
                return nudityId;
            }
            await _productService.Update(product);
            return 0;
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
