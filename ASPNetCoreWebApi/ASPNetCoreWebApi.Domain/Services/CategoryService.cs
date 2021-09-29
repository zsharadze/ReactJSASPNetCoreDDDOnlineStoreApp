using ASPNetCoreWebApi.Domain;
using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            this._repository = repository;
        }

        public Task<int> Add(Category newItem)
        {
            return _repository.Add(newItem);
        }

        public Task<IEnumerable<Category>> GetAllItems()
        {
            return _repository.GetAllItems();
        }

        public Task<Category> GetById(int id)
        {
            return _repository.GetById(id);
        }

        public Task<bool> Remove(int id)
        {
            return _repository.Remove(id);
        }

        public Task<Category> Update(Category item)
        {
            return _repository.Update(item);
        }
    }
}
