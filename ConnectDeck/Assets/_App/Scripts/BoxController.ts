import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { Easing } from "LSTween.lspkg/TweenJS/Easing";
import { LSTween } from "LSTween.lspkg/LSTween";
import { BoxOpenInteraction } from "_App/Scripts/BoxOpenInteraction";

@component
export class BoxController extends BaseScriptComponent {
    
    @input boxOpenInteraction: BoxOpenInteraction;

    @input prevButton: PinchButton;
    @input nextButton: PinchButton;
    @input boxModel: SceneObject;
    @input rotationTime: number;

    private stepIndex: number;
    private maxSteps: number;
    private isRotating: boolean;

    constructor()
    {
        super();
        this.stepIndex = 0;
        this.maxSteps = 4;
    }
    
    onAwake() 
    {
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        });

        this.boxOpenInteraction.onTriggeredCallback = () => {
            this.boxOpen()
        };

        this.boxOpenInteraction.getSceneObject().enabled = false;
    }

    onStart() 
    {
        let prevButtonPressed = (state : InteractorEvent) => { this.previousSide(); }
        let nextButtonPressed = (state : InteractorEvent) => { this.nextSide(); }

        this.prevButton.onButtonPinched.add(prevButtonPressed)
        this.nextButton.onButtonPinched.add(nextButtonPressed)

        this.prevButton.getSceneObject().enabled = false;
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
        print("Step: " + stepIndex);
        this.prevButton.getSceneObject().enabled = stepIndex != 0;
        this.nextButton.getSceneObject().enabled = stepIndex != this.maxSteps - 1;
        this.boxOpenInteraction.getSceneObject().enabled = stepIndex == this.maxSteps - 1;
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
            this.isRotating = false;
        });
    }

    private boxOpen(){
        print("Box Opened!")

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
            this.prevButton.getSceneObject().enabled = false;
            this.nextButton.getSceneObject().enabled = false;
        });
    }
}
