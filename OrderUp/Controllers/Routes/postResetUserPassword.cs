using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postResetUserPassword
    {
        public static ActionResult<UserModel> Execute(Guid webSessionId, PostResetUserPasswordType data, string connectionString)
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

                    // get user with same username as given value
                    command.CommandText = @$"
                        SELECT users.*
                          FROM users
                         WHERE users.username = '{data.username}'
                    ";
                    var reader = command.ExecuteReader();

                    // if no rows returned, no user found with given username
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read returned rows to get user id
                    reader.Read();
                    var user = new UserModel(reader);
                    reader.Close();

                    // hash new password
                    var newSalt = UserController.NewSalt();
                    var newSaltString = UserController.EncodeSalt(newSalt);
                    var newHashedPassword = UserController.ApplyHash(
                        newSalt,
                        data.newPassword
                    );

                    // insert new password
                    command.CommandText = @$"
                        INSERT INTO passwords ( user_id
                                              , hashed_password
                                              , salt
                                              )
                             VALUES ( '{user.id}'
                                    , '{newHashedPassword}'
                                    , '{newSaltString}'
                                    )
                    ";
                    var rowsAffected = command.ExecuteNonQuery();

                    // if no rows affected, password was not inserted
                    if (rowsAffected != 1)
                    {
                        return new BadRequestResult();
                    }

                    // expire any old passwords
                    command.CommandText = @$"
                        UPDATE passwords
                           SET expired = GETDATE()
                         WHERE user_id = '{user.id}'
                           AND expired IS NULL
                           AND hashed_password != '{newHashedPassword}'
                    ";
                    command.ExecuteNonQuery();

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