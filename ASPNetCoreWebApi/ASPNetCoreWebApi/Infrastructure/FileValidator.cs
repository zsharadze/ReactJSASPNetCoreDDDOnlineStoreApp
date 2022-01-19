using System.IO;

namespace ASPNetCoreWebApi.Infrastructure
{
    public class FileValidator
    {
        public bool ValidSize(long size)
        {
            // Maximum file size allowed: 1mb
            return ((size / 1048576d) < 1.1);
        }
    }
}
