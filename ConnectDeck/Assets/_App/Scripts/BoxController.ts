import { PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { Easing } from "LSTween.lspkg/TweenJS/Easing";
import { LSTween } from "LSTween.lspkg/LSTween";
import { BoxOpenInteraction } from "./BoxOpenInteraction";
import { BoxTextLayer } from "./BoxTextLayer";

@component
export class BoxController extends BaseScriptComponent {
    
    public onBoxOpenedCallback?: () => void;

    @input boxOpenInteraction: BoxOpenInteraction;

    @input prevButton: PinchButton;
    @input nextButton: PinchButton;
    @input boxModel: SceneObject;
    @input rotationTime: number;
    @input boxTextLayers: BoxTextLayer[];
    @input welcomeAudio: AudioComponent;

    private stepIndex: number;
    private maxSteps: number;
    private isRotating: boolean;
    private hasPlayedAudio: boolean;

    constructor()
    {
        super();

          this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });

        this.stepIndex = 0;
        this.maxSteps = 4;
    }
    
    onAwake() 
    {
        this.boxOpenInteraction.onTriggeredCallback = () => {
            this.boxOpen();
        };

        this.boxOpenInteraction.enabled = false;
    }

    onStart() 
    {
        let prevButtonPressed = (state : InteractorEvent) => { this.previousSide(); }
        let nextButtonPressed = (state : InteractorEvent) => { this.nextSide(); }

        this.prevButton.onButtonPinched.add(prevButtonPressed)
        this.nextButton.onButtonPinched.add(nextButtonPressed)

        this.prevButton.getSceneObject().enabled = false;

        this.hideBoxTextLayers();
        this.boxTextLayers[0].show();
    }

    private previousSide()
    {
         if (this.isRotating)
        {
            return;
        }

        this.stepIndex--;
        if (this.stepIndex <= 0)
        {
            this.stepIndex = 0;
        }

        this.goToStep(this.stepIndex);
        this.rotateBox(false);
    }
    
    private nextSide()
    {
         if (this.isRotating)
        {
            return;
        }

        this.stepIndex++;
        if (this.stepIndex > this.maxSteps - 1)
        {
            this.stepIndex = this.maxSteps - 1;
        }

        this.rotateBox(true);
        this.goToStep(this.stepIndex);
    }

    private goToStep(stepIndex:number)
    {
        if (stepIndex == 1)
        {
            this.playWelcomeMessage();
        }

        this.prevButton.getSceneObject().enabled = stepIndex != 0;
        this.nextButton.getSceneObject().enabled = stepIndex != this.maxSteps - 1;
        this.boxOpenInteraction.enabled = stepIndex == this.maxSteps - 1;
    }

    private hideBoxTextLayers()
    {
        this.boxTextLayers.forEach(boxText => {
            boxText.hide();
        });
    }

    private rotateBox(rotateRight:boolean) 
    {
        this.isRotating = true;

        var angleMagnitude = 90;
        var rotationAddition = rotateRight ? -angleMagnitude : angleMagnitude;
        
        // Convert degrees to radians
        var radians = rotationAddition * (Math.PI / 180);

        // Rotation we will apply to the object's current rotation
        var rotationToApply = quat.angleAxis(radians, vec3.up());

        // Get the object's current local rotation
        var currentRotation = this.boxModel.getTransform().getLocalRotation();

        // Get the new rotation by rotating the old rotation by rotationToApply
        var newRotation = rotationToApply.multiply(currentRotation);

        // Set the object's world rotation to the new rotation
        this.boxModel.getTransform().setWorldRotation(newRotation);

        LSTween.rotateFromToLocal
        (
                this.boxModel.getTransform(),
                currentRotation,
                newRotation,
                this.rotationTime
        )
        .easing(Easing.Cubic.InOut)
        .start()
        .onComplete(() =>
        {
            // Set the object's world rotation to the new rotation
            this.boxModel.getTransform().setWorldRotation(newRotation);
            this.boxTextLayers[this.stepIndex].show();
            this.isRotating = false;
        });
    }

    private boxOpen()
    {
         this.prevButton.getSceneObject().enabled = false;
        this.nextButton.getSceneObject().enabled = false;

          // Get the object's current local scale
        var currentScale = this.boxModel.getTransform().getLocalScale();

         // Get the new rotation by rotating the old rotation by rotationToApply
        var newScale = vec3.zero();

        LSTween.scaleFromToLocal
        (
                this.boxModel.getTransform(),
                currentScale,
                newScale,
                this.rotationTime
        )
        .easing(Easing.Cubic.InOut)
        .start()
        .onComplete(() =>
        {
            // Set the object's world rotation to the new rotation
            this.boxModel.getTransform().setLocalScale(newScale);
            this.boxModel.enabled = false;
        });

        if (this.onBoxOpenedCallback)
        {
            this.onBoxOpenedCallback();
        }
    }

    private playWelcomeMessage()
    {
        if (this.hasPlayedAudio)
        {
            return;
        }

        this.welcomeAudio.play(0);
        this.hasPlayedAudio = true;
    }
}