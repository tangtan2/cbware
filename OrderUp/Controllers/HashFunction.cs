using System;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace OrderUp.Controllers
{
    public static class HashFunction
    {
        public static byte[] DevSalt()
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            return salt;
        }

        public static string DevEncode(byte[] salt)
        {
            return Convert.ToBase64String(salt);
        }

        public static byte[] DevDecode(string saltString)
        {
            return Convert.FromBase64String(saltString);
        }

        public static string DevHash(byte[] salt, string password)
        {
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
               password: password,
               salt: salt,
               prf: KeyDerivationPrf.HMACSHA1,
               iterationCount: 10000,
               numBytesRequested: 256 / 8));
        }
    }
}