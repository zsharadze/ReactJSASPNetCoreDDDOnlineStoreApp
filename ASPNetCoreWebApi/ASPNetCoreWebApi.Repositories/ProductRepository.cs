using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Repositories
{
    public class ProductRepository : IProductRepository, IAsyncDisposable
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> Add(Product newItem)
        {
            newItem.CreatedDate = DateTime.Now;
            _context.Products.Add(newItem);
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<ProductsViewModel> GetAllItems(int? categoryId, string searchText, int? pageSize, int? pageIndex)
        {
            var result = new ProductsViewModel();
            result.ProductList = new List<Product>();

            var products = _context.Products.AsNoTracking().Include(x => x.Category).Include(x => x.OrderItems).AsQueryable();
            string summaryTextAdd = "";

            if (categoryId != null || searchText != null)
            {
                summaryTextAdd = $" (filtered from {products.Count()} total entries)";
            }

            if (categoryId != null)
            {
                products = products.Where(x => x.CategoryId == categoryId);
            }

            products = products.OrderBy(x => x.Name);

            if (searchText != null)
            {
                products = products.Where(x => x.Name.ToLower().Contains(searchText.ToLower())
                || x.Description.ToLower().Contains(searchText.ToLower()));
            }

            if (pageSize == null || pageIndex == null)
            {
                result.ProductList = await products.ToListAsync();
                return result;
            }
            else if (pageSize.HasValue && pageIndex.HasValue)
            {
                int totalCount = await products.CountAsync();
                PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex.Value, pageSize.Value, summaryTextAdd);
                result.Pager = pagerHelper.GetPager;
                result.ProductList = products.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize).Take(pagerHelper.PageSize).ToList();
                return result;
            }
            else
            {
                throw new Exception("pageSize or pageIndex parameter is null");
            }
        }

        public async Task<Product> GetById(int id)
        {
            return await _context.Products.AsNoTracking().SingleOrDefaultAsync(a => a.Id == id);
        }

        public async Task<bool> Remove(int id)
        {
            Product entity = await _context.Products.SingleOrDefaultAsync(a => a.Id == id);
            if (entity != null)
            {
                var ordersToDelete = _context.OrderItems.Include(x => x.Order)
                    .Where(x => x.ProductId == entity.Id)
                    .Select(x => x.Order);

                if (ordersToDelete.Any())
                {
                    _context.Orders.RemoveRange(ordersToDelete);
                    await _context.SaveChangesAsync();
                }

                _context.Products.Remove(entity);
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

        public async Task<Product> Update(Product item)
        {
            var existing = await _context.Products.AsNoTracking().SingleOrDefaultAsync(a => a.Id == item.Id);
            if (existing != null)
            {
                item.CreatedDate = existing.CreatedDate;
                _context.Products.Update(item);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    throw;
                }
            }
            else
            {
                throw new Exception($"product with id: {item.Id} not found.");
            }

            return existing;
        }

        public ValueTask DisposeAsync()
        {
            return _context.DisposeAsync();
        }
    }
}
