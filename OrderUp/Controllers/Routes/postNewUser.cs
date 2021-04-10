using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrderUp.Models;

namespace OrderUp.Controllers.Routes
{
    public static class postNewUser
    {
        public static ActionResult<UserModel> Execute(PostNewUserType data, string connectionString)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    // create command object
                    var command = new SqlCommand();
                    command.Connection = connection;
                    command.Connection.Open();

                    // insert new user into users table
                    command.CommandText = @$"
                        INSERT INTO users ( name
                                          , user_role
                                          , username
                                          , email
                                          )
                             OUTPUT inserted.*
                             VALUES ( '{data.name}'
                                    , '{data.userRole}'
                                    , '{data.username}'
                                    , '{data.email}'
                                    )
                    ";
                    var reader = command.ExecuteReader();

                    // if nothing was returned, new user was not inserted
                    if (!reader.HasRows)
                    {
                        reader.Close();
                        return new BadRequestResult();
                    }

                    // read returned row to get new user
                    reader.Read();
                    var user = new UserModel(reader);
                    reader.Close();

                    // create new salt and hash password
                    var newSalt = UserController.NewSalt();
                    var newSaltString = UserController.EncodeSalt(newSalt);
                    var hashedPassword = UserController.ApplyHash(newSalt, data.password);

                    // insert salt and hashed password into passwords table under new user id
                    command.CommandText = @$"
                        INSERT INTO passwords ( user_id
                                              , hashed_password
                                              , salt
                                              )
                             VALUES ( '{user.id}'
                                    , '{hashedPassword}'
                                    , '{newSaltString}'
                                    )
                    ";
                    var rowsAffected = command.ExecuteNonQuery();

                    // if no rows affected, new password was not inserted
                    if (rowsAffected != 1)
                    {
                        return new BadRequestResult();
                    }

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