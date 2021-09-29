using ASPNetCoreWebApi.Domain;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace ASPNetCoreWebApi
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime RegistrationDate { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
