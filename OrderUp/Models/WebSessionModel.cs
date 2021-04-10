using System;
using Microsoft.Data.SqlClient;

namespace OrderUp.Models
{
    public class WebSessionModel
    {
        public Guid id { get; set; }
        public Guid userId { get; set; }
        public DateTime created { get; set; }
        public DateTime? expired { get; set; }
        public WebSessionModel(SqlDataReader reader)
        {
            id = Guid.Parse(reader["id"].ToString());
            userId = Guid.Parse(reader["user_id"].ToString());
            created = DateTime.Parse(reader["created"].ToString());
            expired = reader["expired"] == DBNull.Value
                ? null
                : DateTime.Parse(reader["expired"].ToString());
        }
    }
}