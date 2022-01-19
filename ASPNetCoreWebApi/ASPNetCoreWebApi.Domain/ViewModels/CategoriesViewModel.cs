﻿using ASPNetCoreWebApi.Domain.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.ViewModels
{
    public class CategoriesViewModel
    {
        public List<CategoryDto> CategoryList { get; set; }
        public Pager Pager { get; set; }
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FaClass { get; set; }//font awsome 4.7.0 class: "fa fa-desktop" for example
        public string ImageSrc { get; set; }
        public int ProductsCount { get; set; }
    }
}
