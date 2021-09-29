using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ASPNetCoreWebApi.Domain
{
    [Microsoft.EntityFrameworkCore.Index(nameof(PromoCodeText), IsUnique = true)]
    public class PromoCode
    {
        public int Id { get; set; }
        [Required]
        public string PromoCodeText { get; set; }
        public bool IsUsed { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Discount { get; set; }
        [NotMapped]
        public string UsedByUserEmail { get; set; }
        [NotMapped]
        public int UsedOnOrderId { get; set; }
    }
}
