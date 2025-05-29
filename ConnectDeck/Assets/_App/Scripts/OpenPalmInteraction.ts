@component
export class OpenPalmInteraction extends BaseScriptComponent {

    private gestureModule: GestureModule = require('LensStudio:GestureModule');

    @input leftHand: SceneObject;
    @input cardUiOffset: vec3;
    @input cardUi: SceneObject;

    onAwake() {
    
        // Follow hand
        this.gestureModule
        .getTargetingDataEvent(GestureModule.HandType.Left)
        .add((targetArgs: TargetingDataArgs) => {

            var xOffset = this.leftHand.getTransform().right.x * this.cardUiOffset.x;
            var yOffset = this.leftHand.getTransform().up.y * this.cardUiOffset.y;
            var zOffset = this.leftHand.getTransform().forward.z * this.cardUiOffset.z;
            
            var destPoint = new vec3
            (
            targetArgs.rayOriginInWorld.x, 
            targetArgs.rayOriginInWorld.y + yOffset, 
            targetArgs.rayOriginInWorld.z
            );

            print(this.leftHand.getTransform().up);

            var isLeftPalmUp = this.leftHand.getTransform().up.y <= -.4;
            this.cardUi.enabled = isLeftPalmUp;

            this.cardUi.getTransform().setWorldPosition(destPoint);
        });
    }
}
