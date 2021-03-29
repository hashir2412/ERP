using System;

namespace ERP.Model.DbModel
{
    public class SalesOrderDbModel
    {
        public int SalesOrderId { get; set; }

        public int ConsumerID { get; set; }

        public DateTime SaleDate { get; set; }

        public double Total { get; set; }

        public double TotalWithoutTax { get; set; }

        public ConsumerDbModel Consumer { get; set; }

    }
}
