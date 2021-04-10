using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postNewOrders
    {
        public static ActionResult<List<OrderModel>> Execute(Guid webSessionId, List<PostNewOrdersType> data, string connectionString)
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

                    // iterate through new orders
                    var newOrders = new List<OrderModel>();
                    foreach (var order in data)
                    {
                        // insert into database
                        command.CommandText = @$"
                            INSERT INTO orders ( part
                                               , user_id
                                               , quantity
                                               , orderer
                                               , work_order
                                               , notes
                                               )
                                 OUTPUT inserted.*
                                 VALUES ( '{order.part}'
                                        , '{userId}'
                                        , '{order.quantity}'
                                        , '{order.orderer}'
                                        , '{order.workOrder}'
                                        , {(order.notes != null ? "'" + order.notes + "'" : "null")}
                                        )
                        ";
                        reader = command.ExecuteReader();

                        // if order could not be inserted into database, bad request
                        if (!reader.HasRows)
                        {
                            reader.Close();
                            return new BadRequestResult();
                        }

                        // add generated fields to order object
                        reader.Read();
                        newOrders.Add(new OrderModel(reader));
                        reader.Close();
                    }

                    return new OkObjectResult(newOrders);
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