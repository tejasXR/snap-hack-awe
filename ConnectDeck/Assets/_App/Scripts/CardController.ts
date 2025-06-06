import { CardData } from "./CardData";
import { LSTween } from "LSTween.lspkg/LSTween";
import { Billboard } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard";
import { Easing } from "SpectaclesSyncKit.lspkg/Mapping/src/UI/ObjectLocator/animations/tween";

@component
export class CardController extends BaseScriptComponent {
    
    @input cardName: Image;
    @input cardFace: Image;
    @input details: Text;
    @input iceBreaker: Text;
    @input("float", "1000") animateTweenTime: number;

    @input billboard: Billboard

    constructor() {
        super();
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        })
    }

    private onStart()
    {
        this.getTransform().setWorldScale(vec3.zero());

        var rotationToApply = quat.fromEulerAngles(0, -180, 0);
        var currentRotation = this.getTransform().getWorldRotation();
        var newRotation = rotationToApply.multiply(currentRotation);
        this.getTransform().setWorldRotation(newRotation);

        this.billboard.enabled = false;
    }

    public setup(cardData:CardData)
    {
        // Configure + Animate Card
        this.configureCardData(cardData);
        this.animateIn();
    }

    private configureCardData(cardData:CardData)
    {
        this.cardName.mainMaterial = cardData.cardName;
        this.cardFace.mainMaterial = cardData.cardFace;
        this.details.text = cardData.details;
        this.iceBreaker.text = cardData.iceBreaker;
    }

    private animateIn()
    {
        var newScale = vec3.one();

        var degreesToRotate = 720;
        var radiansToRotate = degreesToRotate * (Math.PI / 180);

        // Scale
        LSTween.scaleFromToWorld
        (
                this.getTransform(),
                this.getTransform().getWorldScale(),
                newScale,
                this.animateTweenTime
        )
        .easing(Easing.Back.Out)
        .start()
        .onComplete(() =>
        {
            // Set the object's world scale to the new rotation
            this.getTransform().setWorldScale(newScale);
        });

        // Rotation
        var rotationToApply = quat.angleAxis(0, vec3.up());
        var currentRotation = this.getTransform().getWorldRotation();

        LSTween.rotateFromToWorld
        (
                this.getTransform(),
                currentRotation,
                rotationToApply,
                this.animateTweenTime
        )
        .easing(Easing.Back.Out)
        .start()
        .onComplete(() =>
        {
            // Set the object's world rotation to the new rotation
            this.getTransform().setWorldRotation(rotationToApply);
            this.billboard.enabled = true;
        });
    }
}