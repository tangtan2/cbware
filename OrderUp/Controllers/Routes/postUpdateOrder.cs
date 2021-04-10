using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postUpdateOrder
    {
        public static ActionResult<OrderModel> Execute(Guid webSessionId, PostUpdateOrderType data, string connectionString)
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

                    // update order with completion time
                    command.CommandText = @$"
                        UPDATE orders
                           SET orders.completed = GETDATE()
                             , orders.completed_notes = {(data.completedNotes != null ? "'" + data.completedNotes + "'" : "null")}
                        OUTPUT inserted.*
                         WHERE orders.id = '{data.id}'
                    ";
                    var reader = command.ExecuteReader();

                    // if no rows affected, given order was not found
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read returned row to get updated order
                    reader.Read();
                    var order = new OrderModel(reader);
                    reader.Close();

                    return new OkObjectResult(order);
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