import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import Easing from "LSTween.lspkg/TweenJS/Easing";
import { LSTween } from "LSTween.lspkg/LSTween";

@component
export class NewScript extends BaseScriptComponent {
    
    @input prevButton: PinchButton;
    @input nextButton: PinchButton;
    @input boxModel: SceneObject;
    @input rotationTime: number;

    private destinationRotation: quat;
    
    onAwake() 
    {
        this.createEvent('OnStartEvent').bind(() => {
            this.onStart();
        })

        this.destinationRotation = this.boxModel.getTransform().getLocalRotation();
    }

    onStart() 
    {
        let prevButtonPressed = (state : InteractorEvent) => { this.previousSide(); }
        let nextButtonPressed = (state : InteractorEvent) => { this.nextSide(); }

        this.prevButton.onButtonPinched.add(prevButtonPressed)
        this.nextButton.onButtonPinched.add(nextButtonPressed)
    }

    private previousSide()
    {
       this.rotateBox(false);

        print("Previous");

    }
    
    private nextSide()
    {
        this.rotateBox(true);
        print("Next");
    }

    private rotateBox(rotateRight:boolean) {
        let currentRotation = this.boxModel.getTransform().getLocalRotation();
        print("Current rotation: " + currentRotation.toEulerAngles());

        var angleMagnitude = 90;
        var rotationAddition = rotateRight ? angleMagnitude : -angleMagnitude;
        
        // Convert degrees to radians
        var radians = rotationAddition * (Math.PI / 180);

        // Rotation we will apply to the object's current rotation
        var rotationToApply = quat.angleAxis(radians, vec3.up());

        // Get the object's current local rotation
        var oldRotation = this.boxModel.getTransform().getLocalRotation();

        // Get the new rotation by rotating the old rotation by rotationToApply
        var newRotation = rotationToApply.multiply(oldRotation);

        // Set the object's world rotation to the new rotation
        this.boxModel.getTransform().setWorldRotation(newRotation);

        // var rotationAddition = rotateRight ? angleMagnitude : -angleMagnitude;

        // this.destinationRotation = currentRotation;
        // this.destinationRotation.y += rotationAddition;

        // print("Trying to rotate to " + this.destinationRotation);

        LSTween.rotateFromToLocal
        (
                this.boxModel.getTransform(),
                oldRotation,
                newRotation,
                this.rotationTime
        )
        .easing(Easing.Cubic.InOut)
        .start()
        .onComplete(() =>
        {
            // Set the object's world rotation to the new rotation
            this.boxModel.getTransform().setWorldRotation(newRotation);
        });
    }
}
