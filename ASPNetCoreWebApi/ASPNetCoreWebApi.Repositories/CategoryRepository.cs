using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Repositories
{
    public class CategoryRepository : ICategoryRepository, IAsyncDisposable
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> Add(Category newItem)
        {
            _context.Categories.Add(newItem);
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<IEnumerable<Category>> GetAllItems()
        {
            return await _context.Categories.AsNoTracking().ToListAsync();
        }

        public async Task<Category> GetById(int id)
        {
            return await _context.Categories.AsNoTracking().SingleOrDefaultAsync(a => a.Id == id);
        }

        public async Task<bool> Remove(int id)
        {
            Category entity = await _context.Categories.Include(x => x.Products).SingleOrDefaultAsync(a => a.Id == id);
            if (entity != null)
            {
                if (entity.Products.Any())
                {
                    return false;
                }
                _context.Categories.Remove(entity);
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

        public async Task<Category> Update(Category item)
        {
            var existing = await _context.Categories.AsNoTracking().SingleOrDefaultAsync(a => a.Id == item.Id);
            if (existing != null)
            {
                _context.Categories.Update(item);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    throw;
                }
            }

            return existing;
        }

        public ValueTask DisposeAsync()
        {
            return _context.DisposeAsync();
        }
    }
}