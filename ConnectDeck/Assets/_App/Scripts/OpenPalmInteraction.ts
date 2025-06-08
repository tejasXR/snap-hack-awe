import { CardController } from "_App/Scripts/CardController";

@component
export class OpenPalmInteraction extends BaseScriptComponent {

    private gestureModule: GestureModule = require('LensStudio:GestureModule');

    @input cardController: CardController

    @input leftHand: SceneObject;
    @input rightHand: SceneObject;

    @input cardUiOffset: vec3;
    @input cardUi: SceneObject;

    @input compassOffset: vec3;
    @input compass: SceneObject;

    constructor()
    {
        super();

        // this.createEvent('OnEnableEvent').bind(() => this.onEnable());
        // this.createEvent('OnStartEvent').bind(() => this.onStart());
    }

    onAwake()
    {
        this.cardController.onConnectionSentCallback = () => {
            this.onStartTracking();
        }

        this.cardUi.enabled = false;
        this.compass.enabled = false;
    }

    private onStartTracking() 
    {
        this.cardUi.enabled = true;
        this.compass.enabled = true;

        // -- Card UI --
        this.gestureModule
        .getTargetingDataEvent(GestureModule.HandType.Left)
        .add((targetArgs: TargetingDataArgs) => {

            var yOffset = this.leftHand.getTransform().up.y * this.cardUiOffset.y;
            
            var destPoint = new vec3
            (
            targetArgs.rayOriginInWorld.x, 
            targetArgs.rayOriginInWorld.y - yOffset, 
            targetArgs.rayOriginInWorld.z
            );

            var isLeftPalmUp = this.leftHand.getTransform().up.y <= -.4;
            this.cardUi.enabled = isLeftPalmUp;

            this.cardUi.getTransform().setWorldPosition(destPoint);
        });

        // -- Wayfinder UI --
        this.gestureModule
        .getTargetingDataEvent(GestureModule.HandType.Right)
        .add((targetArgs: TargetingDataArgs) => {

            var yOffset = this.rightHand.getTransform().up.y * this.compassOffset.y;
            
            var destPoint = new vec3
            (
            targetArgs.rayOriginInWorld.x, 
            targetArgs.rayOriginInWorld.y - yOffset, 
            targetArgs.rayOriginInWorld.z
            );

            var isRightPalmUp = this.rightHand.getTransform().up.y <= -.4;
            this.compass.enabled = isRightPalmUp;

            this.compass.getTransform().setWorldPosition(destPoint);
        });
    }
}
