using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class getActiveOrdersAllUsers
    {
        public static ActionResult<List<OrderModel>> Execute(Guid webSessionId, string connectionString)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    // create command object
                    var command = new SqlCommand();
                    command.Connection = connection;
                    command.Connection.Open();

                    // authenticate web session
                    if (!WebSessionCheck.Check(webSessionId, connection, command))
                    {
                        return new UnauthorizedResult();
                    }

                    // select all active orders
                    command.CommandText = @$"
                        SELECT orders.*
                          FROM orders
                         WHERE orders.completed IS NULL
                    ";
                    var reader = command.ExecuteReader();

                    // read returned rows to get orders
                    var activeOrders = new List<OrderModel>();
                    while (reader.Read())
                    {
                        activeOrders.Add(new OrderModel(reader));
                    }
                    reader.Close();

                    return new OkObjectResult(activeOrders);
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