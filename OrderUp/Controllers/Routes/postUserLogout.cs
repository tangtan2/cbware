using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postUserLogout
    {
        public static ActionResult<WebSessionModel> Execute(Guid webSessionId, string connectionString)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    // create command object
                    var command = new SqlCommand();
                    command.Connection = connection;
                    command.Connection.Open();

                    // expire given web session on user logout
                    command.CommandText = @$"
                        UPDATE web_sessions
                           SET web_sessions.expired = GETDATE()
                        OUTPUT inserted.*
                         WHERE web_sessions.id = '{webSessionId}'
                    ";
                    var reader = command.ExecuteReader();

                    // if no rows returned, web session was not found
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read returned row to get expired web session
                    reader.Read();
                    var expiredWebSession = new WebSessionModel(reader);
                    reader.Close();

                    return new OkObjectResult(expiredWebSession);
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