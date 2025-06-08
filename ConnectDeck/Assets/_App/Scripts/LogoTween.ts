import Easing from "LSTween.lspkg/TweenJS/Easing";
import { LSTween } from "LSTween.lspkg/LSTween";

@component
export class LogoTween extends BaseScriptComponent {
    
    @input("float", "3000") tweenTime: number;
    
    onAwake() 
     {
        // Rotate a bit
        let startRotation = this.getTransform().getLocalRotation();
        let zAngle = -4;
        let zRadian = zAngle * (Math.PI / 180);
        let rotationToApply = quat.angleAxis(zRadian, vec3.forward());

        let destinationRotation = rotationToApply.multiply(startRotation);
       
       LSTween.rotateFromToLocal(
         this.getTransform(),
         startRotation,
         destinationRotation,
         this.tweenTime * 2
       )
         .easing(Easing.Sinusoidal.InOut)
         .delay(100) // There is a bug in TweenJS where the yoyo value will jump if no delay is set.
         .yoyo(true)
         .repeat(Infinity)
         .start();

    //     // Move up and down
       let transform = this.getTransform();
       let startPosition = transform.getLocalPosition();
       let destinationPosition = startPosition.add(new vec3(0, -.5, 0));
       
       LSTween.moveFromToLocal(
         this.getTransform(),
         startPosition,
         destinationPosition,
         this.tweenTime
       )
         .easing(Easing.Sinusoidal.InOut)
         .delay(100) // There is a bug in TweenJS where the yoyo value will jump if no delay is set.
         .yoyo(true)
         .repeat(Infinity)
         .start();
     }
}
