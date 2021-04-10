using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class getHistoricalOrdersByLimitPerUser
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

                    // select user associated with given web session id
                    command.CommandText = @$"
                        SELECT users.id
                          FROM users
                          JOIN web_sessions
                            ON users.id = web_sessions.user_id
                         WHERE web_sessions.id = '{webSessionId}'
                           AND web_sessions.expired IS NULL
                    ";
                    var reader = command.ExecuteReader();

                    // if no rows returned, user was not found
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new NotFoundResult();
                    }

                    // read returned row to get user id
                    reader.Read();
                    var userId = reader["id"].ToString();
                    reader.Close();

                    // select the last however many orders for given user
                    command.CommandText = @$"
                        SELECT orders.*
                          FROM orders
                         WHERE orders.userId = '{userId}'
                           AND completed IS NOT NULL
                         ORDER BY orders.completed DESC
                         LIMIT {limit}
                    ";
                    reader = command.ExecuteReader();

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