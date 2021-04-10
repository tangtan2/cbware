using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class getAuthenticateAndVerifyWebSession
    {
        public static ActionResult<UserModel> Execute(Guid webSessionId, string connectionString)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    // create command object
                    var command = new SqlCommand();
                    command.Connection = connection;
                    command.Connection.Open();

                    // get web session and associated user
                    command.CommandText = @$"
                        SELECT users.*
                          FROM web_sessions
                          JOIN users
                            ON web_sessions.user_id = users.id
                         WHERE web_sessions.id = '{webSessionId}'
                           AND web_sessions.expired IS NULL
                    ";
                    var reader = command.ExecuteReader();

                    // if no rows returned, web session is not active
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read return row to get user
                    reader.Read();
                    var user = new UserModel(reader);
                    reader.Close();

                    return new OkObjectResult(user);
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