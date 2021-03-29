using Dapper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace ERP.Model
{
    public class TestDemo
    {
        public static string CONNECTIONSTRING = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=ERP;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
        public string Yo()
        {

            using (var connection = new SqlConnection(CONNECTIONSTRING))
            {
                var sql = "select * from Measure";
                var customers = connection.Query(sql);
                string s ="";
                foreach (var customer in customers)
                {
                   s= $"{customer.ItemQuantityValue} {customer.ItemQuantityName}";
                }
                return s;
            }
        }
    }
}
