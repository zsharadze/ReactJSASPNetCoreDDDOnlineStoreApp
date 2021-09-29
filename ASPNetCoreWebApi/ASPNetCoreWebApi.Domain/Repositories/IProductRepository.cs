using ASPNetCoreWebApi.Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IProductRepository
    {
        Task<ProductsViewModel> GetAllItems(int? categoryId, string searchText, int? pageSize, int? pageIndex);
        Task<int> Add(Product newItem);
        Task<Product> Update(Product item);
        Task<Product> GetById(int id);
        Task<bool> Remove(int id);
    }
}
