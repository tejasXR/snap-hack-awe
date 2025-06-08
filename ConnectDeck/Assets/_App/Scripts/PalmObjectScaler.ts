import { LSTween } from "LSTween.lspkg/LSTween";
import { Easing } from "SpectaclesSyncKit.lspkg/Mapping/src/UI/ObjectLocator/animations/tween";

@component
export class CompassController extends BaseScriptComponent {
    
    @input container: SceneObject;
    @input tweenTime: number;

    constructor()
    {
        super();

        this.createEvent('OnEnableEvent').bind (() => this.onEnable());
        // this.createEvent('OnDisableEvent').bind (() => this.onDisable());
    }

    private onEnable() 
    {
        this.container.getTransform().setLocalScale(vec3.zero());
        var targetScale = vec3.one();
        this.scaleContainer(targetScale);
    }

    private onUpdate()
    {
        // var targetRotation = this.
    }

    private onDisable()
    {
        var targetScale = vec3.one();
        this.scaleContainer(targetScale);
    }

    private scaleContainer(targetScale:vec3)
    {
        LSTween.scaleToLocal
        (
            this.container.getTransform(),
            targetScale,
            this.tweenTime
        )
        .easing(Easing.Back.Out)
        .start()
        .onComplete(()=>{
            this.container.getTransform().setLocalScale(targetScale);
        });
    }
}