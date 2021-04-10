using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postNewOrderParts
    {
        public static ActionResult<List<string>> Execute(Guid webSessionId, List<string> partNames, string connectionString)
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

                    // iterate through new parts
                    var newParts = new List<string>();
                    foreach (var part in partNames)
                    {
                        // add part to database
                        command.CommandText = @$"
                            INSERT INTO parts ( name )
                            VALUES ( '{part}' )
                            OUTPUT inserted.*
                        ";
                        var reader = command.ExecuteReader();

                        // if no rows returned, part was not inserted
                        if (!reader.HasRows)
                        {
                            reader.Close();
                            return new BadRequestResult();
                        }

                        // read returned row to get inserted part
                        reader.Read();
                        newParts.Add(reader["name"].ToString());
                        reader.Close();
                    }

                    return new OkObjectResult(newParts);
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