namespace ObjectsVisualizer.Services.FilePath
{
    public interface IFilePath
    {
        String GetModelDir();
        String GetImageDir();
        String GetModel();
        String GetImage();
        Task SetFile(string file);

    }
}
