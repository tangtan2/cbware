using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postUpdateUserRole
    {
        public static ActionResult<UserModel> Execute(Guid webSessionId, PostUpdateUserRoleType data, string connectionString)
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

                    // update user with given username to be new role
                    command.CommandText = @$"
                           UPDATE users
                              SET user_role = '{data.newUserRole}'
                            WHERE users.username = '{data.username}'
                    ";
                    var rowsAffected = command.ExecuteNonQuery();

                    // if no rows affected, user was not sucessfully updated
                    if (rowsAffected != 1)
                    {
                        return new BadRequestResult();
                    }

                    // get updated user
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

                    // read rows to get user object
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