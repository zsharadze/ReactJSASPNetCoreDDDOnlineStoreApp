using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Contracts;
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
    [Route("api/[controller]/[action]")]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: Category/GetAll
        [HttpGet]
        public async Task<IEnumerable<Category>> GetAll()
        {
            var categories = await _categoryService.GetAllItems();
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
            return await _categoryService.Add(category);
        }

        // PUT: Category/Edit
        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<Category> Edit([FromBody] Category category)
        {
            return await _categoryService.Update(category);
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
