namespace ERP.Model
{
    public class BaseResponse<T>
    {
        public int ErrorCode { get; set; }

        public string ErrorMessage { get; set; }

        public T Data { get; set; }
    }
}
