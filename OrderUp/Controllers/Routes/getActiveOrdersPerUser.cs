using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class getActiveOrdersPerUser
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
                        return new BadRequestResult();
                    }

                    // read returned row to get user id
                    reader.Read();
                    var userId = reader["id"].ToString();
                    reader.Close();

                    // select all active orders for selected user
                    command.CommandText = @$"
                        SELECT orders.*
                          FROM orders
                         WHERE orders.user_id = '{userId}'
                           AND orders.completed IS NULL
                    ";
                    reader = command.ExecuteReader();

                    // read returned rows to get active orders
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