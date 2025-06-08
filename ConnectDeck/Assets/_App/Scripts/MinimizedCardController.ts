@component
export class MinimizedCardController extends BaseScriptComponent {

    @input nameImage: Image;
    @input minimizedInfo: Image;

    public setup(nameData:Material, minimizedData: Material)
    {
        this.nameImage.mainMaterial = nameData;
        this.minimizedInfo.mainMaterial = minimizedData;
    }
}
