using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.ViewModels;
using ASPNetCoreWebApi.Infrastructure;
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
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly NudeImageDetectorHelper _nudeImageDetectorHelper;
        private readonly FileValidator _fileValidator;
        public CategoryController(ICategoryService categoryService, NudeImageDetectorHelper nudeImageDetectorHelper, FileValidator fileValidator)
        {
            _categoryService = categoryService;
            _nudeImageDetectorHelper = nudeImageDetectorHelper;
            _fileValidator = fileValidator;
        }

        // GET: Category/GetAll
        [HttpGet]
        public async Task<CategoriesViewModel> GetAll(string searchText = null, int? pageSize = null, int? pageIndex = 1)
        {
            var categories = await _categoryService.GetAllItems(searchText, pageSize, pageIndex);
            return categories;
        }

        // GET: Category/Details/?id=5
        [HttpGet]
        public async Task<Category> Details(int id)
        {
            return await _categoryService.GetById(id);
        }

        // POST: Category/Create
        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<int> Create([FromBody] Category category)
        {
            if (string.IsNullOrEmpty(category.FaClass) && string.IsNullOrEmpty(category.ImageSrc))
            {
                throw new Exception("FaClass and ImageSrc both can't be null");
            }

            if (!string.IsNullOrEmpty(category.ImageSrc))
            {
                byte[] imageBytes = Convert.FromBase64String(category.ImageSrc);
                if (!_fileValidator.ValidSize(imageBytes.Length))
                {
                    return -500;
                }
                var nudityId = await _nudeImageDetectorHelper.IsNudeImage(imageBytes);
                if (nudityId != 0)
                {
                    return nudityId;
                }
            }
            await _categoryService.Add(category);
            return 0;
        }

        // PUT: Category/Edit
        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<int> Edit([FromBody] Category category)
        {
            byte[] imageBytes = Convert.FromBase64String(category.ImageSrc);
            if (!_fileValidator.ValidSize(imageBytes.Length))
            {
                return -500;
            }
            if (!string.IsNullOrEmpty(category.ImageSrc))
            {
                var nudityId = await _nudeImageDetectorHelper.IsNudeImage(imageBytes);
                if (nudityId != 0)
                {
                    return nudityId;
                }
            }
            await _categoryService.Update(category);
            return 0;
        }

        // DELETE: Category/Delete/?id=5
        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<bool> Delete(int id)
        {
            return await _categoryService.Remove(id);
        }
    }
}