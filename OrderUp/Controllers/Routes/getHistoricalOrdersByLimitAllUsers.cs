using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class getHistoricalOrdersByLimitAllUsers
    {
        public static ActionResult<List<OrderModel>> Execute(Guid webSessionId, int limit, string connectionString)
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

                    // select the last however many orders for all users
                    command.CommandText = @$"
                        SELECT orders.*
                          FROM orders
                         WHERE orders.completed IS NOT NULL
                         ORDER BY orders.completed DESC
                         LIMIT {limit}
                    ";
                    var reader = command.ExecuteReader();

                    // read returned rows to get historical orders
                    var historicalOrders = new List<OrderModel>();
                    while (reader.Read())
                    {
                        historicalOrders.Add(new OrderModel(reader));
                    }
                    reader.Close();

                    return new OkObjectResult(historicalOrders);
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