using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace OrderUp.Controllers.Routes
{
    public static class getAllOrderParts
    {
        public static ActionResult<List<string>> Execute(Guid webSessionId, string connectionString)
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

                    // get all part names from database
                    command.CommandText = @$"
                        SELECT *
                          FROM parts
                    ";
                    var reader = command.ExecuteReader();

                    // read rows to get part names
                    var partIds = new List<string>();
                    while (reader.Read())
                    {
                        partIds.Add(reader["name"].ToString());
                    }
                    reader.Close();

                    return new OkObjectResult(partIds);
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