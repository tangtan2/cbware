using System;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;

namespace OrderUp.Models
{
    public class UserModel
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public string userRole { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public DateTime? verified { get; set; }
        public Guid? verifierUserId { get; set; }

        public UserModel(SqlDataReader reader)
        {
            id = Guid.Parse(reader["id"].ToString());
            name = reader["name"].ToString();
            userRole = reader["user_role"].ToString();
            username = reader["username"].ToString();
            email = reader["email"].ToString();
            verified = reader["verified"] == DBNull.Value
                ? null
                : DateTime.Parse(reader["verified"].ToString());
            verifierUserId = reader["verifier_user_id"] == DBNull.Value
                ? null
                : Guid.Parse(reader["verifier_user_id"].ToString());
        }
    }
}