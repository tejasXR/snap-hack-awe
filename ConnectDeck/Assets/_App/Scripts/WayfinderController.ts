@component
export class WayfinderController extends BaseScriptComponent {
    
    @input nameImage: Image;

    public setup(nameData:Material)
    {
        this.nameImage.mainMaterial = nameData;
    }
}
