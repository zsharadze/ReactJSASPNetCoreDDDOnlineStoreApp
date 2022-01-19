using ASPNetCoreWebApi.Domain.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface ICategoryRepository
    {
        Task<CategoriesViewModel> GetAllItems(string searchText, int? pageSize, int? pageIndex);
        Task<int> Add(Category newItem);
        Task<Category> Update(Category item);
        Task<Category> GetById(int id);
        Task<bool> Remove(int id);
    }
}
