using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllItems();
        Task<int> Add(Category newItem);
        Task<Category> Update(Category item);
        Task<Category> GetById(int id);
        Task<bool> Remove(int id);
    }
}
