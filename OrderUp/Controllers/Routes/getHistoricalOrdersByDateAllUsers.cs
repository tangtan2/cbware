using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class getHistoricalOrdersByDateAllUsers
    {
        public static ActionResult<List<OrderModel>> Execute(Guid webSessionId, DateTime startDate, DateTime endDate, string connectionString)
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

                    // select all orders within given date range
                    command.CommandText = @$"
                        SELECT orders.*
                          FROM orders
                         WHERE orders.placed > '{startDate.ToShortDateString()}'
                           AND orders.placed < '{endDate.ToShortDateString()}'
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