using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postVerifyUser
    {
        public static ActionResult<UserModel> Execute(Guid webSessionId, PostVerifyUserType data, string connectionString)
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

                    // update user, set verified time to now and set verifier user id to given value
                    command.CommandText = @$"
                        UPDATE users
                           SET verified = GETDATE()
                             , verifier_user_id = (SELECT users.id
                                                     FROM users
                                                     JOIN web_sessions
                                                       ON users.id = web_sessions.user_id
                                                    WHERE web_sessions.id = '{data.webSessionId}')
                         WHERE username = '{data.username}'
                    ";
                    var rowsAffected = command.ExecuteNonQuery();

                    // if no rows affected, user was not updated
                    if (rowsAffected != 1)
                    {
                        return new BadRequestResult();
                    }

                    // select updated user from database
                    command.CommandText = @$"
                        SELECT *
                          FROM users
                         WHERE username = '{data.username}'
                    ";
                    var reader = command.ExecuteReader();

                    // if no rows returned, user was not found
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read returned row to get user
                    reader.Read();
                    var user = new UserModel(reader);
                    reader.Close();

                    // if here, everything ran properly
                    return new OkObjectResult(user); ;
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