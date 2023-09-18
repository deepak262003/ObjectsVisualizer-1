namespace ObjectsVisualizer.Services.FilePath
{
    public class FilePath : IFilePath
    {
        private String? _file;
        private String? _modelDir;
        private String? _imageDir;

        public FilePath()
        {
            _file = "c786b97d08b94d02a1fa3b87d2e86cf1";
            _modelDir = "glbs/000-023";
            _imageDir = "thumbnails";
        }
        public string GetModel()
        {
            return _file + ".glb";
        }

        public string GetImage()
        {
            return _file + ".jpeg";
        }
        public string GetModelDir()
        {
            return _modelDir;
        }

        public string GetImageDir()
        {
            return _imageDir;
        }


        public async Task SetFile(string file)
        {
            _file = file;
        }

        public void SetModelDir(string folder)
        {
            _modelDir = "glbs/"+folder;
        }

    }
}
