using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postDeleteOrderPart
    {
        public static ActionResult<string> Execute(Guid webSessionId, string partName, string connectionString)
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

                    // delete part from database
                    command.CommandText = @$"
                        DELETE FROM parts
                        OUTPUT deleted.*
                         WHERE parts.name = '{partName}'
                    ";
                    var reader = command.ExecuteReader();

                    // if no rows returned, part was not deleted
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read returned row to get deleted part
                    reader.Read();
                    var deletedPart = reader["name"].ToString();
                    reader.Close();

                    return new OkObjectResult(deletedPart);
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