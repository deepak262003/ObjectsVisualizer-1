using Microsoft.AspNetCore.Components;

namespace ObjectsVisualizer.Services.Callbacks
{
    public class Callbacks 
    {
        public event Action LoadModel;

        public void OnLoadModelClicked()
        {
             LoadModel.Invoke();
        }

    }
}
