using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class getAllUsers
    {
        public static ActionResult<List<UserModel>> Execute(string connectionString)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    // create command object
                    var command = new SqlCommand();
                    command.Connection = connection;
                    command.Connection.Open();

                    // get user with given username
                    command.CommandText = @$"
                        SELECT users.*
                          FROM users
                    ";
                    var reader = command.ExecuteReader();

                    // read returning row to create new user object
                    var users = new List<UserModel>();
                    while (reader.Read())
                    {
                        users.Add(new UserModel(reader));
                    }
                    reader.Close();

                    return new OkObjectResult(users);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new BadRequestResult();
            }
        }
    }
}