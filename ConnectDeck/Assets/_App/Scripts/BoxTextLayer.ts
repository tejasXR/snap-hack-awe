import { LSTween } from "LSTween.lspkg/LSTween";
import { Easing } from "SpectaclesSyncKit.lspkg/Mapping/src/UI/ObjectLocator/animations/tween";

@component
export class BoxTextLayer extends BaseScriptComponent {
    
    @input("float", "250") tweenTime: number;
    // @input container: SceneObject;

    public show(){
        this.scaleContainer(vec3.one());
    }

    public hide(){
        this.scaleContainer(vec3.zero());
    }

     private scaleContainer(targetScale:vec3)
    {
        LSTween.scaleToLocal
        (
            this.getTransform(),
            targetScale,
            this.tweenTime
        )
        .easing(Easing.Back.Out)
        .start()
        .onComplete(()=>{
            this.getTransform().setLocalScale(targetScale);
        });
    }


}
