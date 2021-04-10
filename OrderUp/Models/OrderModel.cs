using System;
using Microsoft.Data.SqlClient;

namespace OrderUp.Models
{
    public class OrderModel
    {
        public Guid id { get; set; }
        public string part { get; set; }
        public Guid userId { get; set; }
        public decimal quantity { get; set; }
        public string notes { get; set; }
        public DateTime placed { get; set; }
        public DateTime? completed { get; set; }
        public string completedNotes { get; set; }
        public string orderer { get; set; }
        public string workOrder { get; set; }

        public OrderModel(SqlDataReader reader)
        {
            id = Guid.Parse(reader["id"].ToString());
            part = reader["part"].ToString();
            userId = Guid.Parse(reader["user_id"].ToString());
            quantity = decimal.Parse(reader["quantity"].ToString());
            notes = reader["notes"] == DBNull.Value
                ? null
                : reader["notes"].ToString();
            placed = DateTime.Parse(reader["placed"].ToString());
            completed = reader["completed"] == DBNull.Value
                ? null
                : DateTime.Parse(reader["completed"].ToString());
            completedNotes = reader["completed_notes"] == DBNull.Value
                ? null
                : reader["completed_notes"].ToString();
            orderer = reader["orderer"].ToString();
            workOrder = reader["work_order"].ToString();
        }
    }
}