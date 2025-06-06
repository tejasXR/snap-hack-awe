@component
export class BoxOpenInteraction extends BaseScriptComponent {
    
    public onTriggeredCallback?: () => void;

    @input leftHand: SceneObject;
    @input rightHand: SceneObject;

    @input distanceTriggerThreshold: number;
    private isTriggered: boolean;
    
    constructor()
    {
        super();
        this.createEvent('UpdateEvent').bind(() => {
            this.onUpdate()
        });
    }

    private onUpdate()
    {
        if (!this.enabled)
        {
            return;
        }

        if (this.isTriggered)
        {
            return;
        }

        var leftHandPosition = this.leftHand.getTransform().getWorldPosition();
        var rightHandPosition = this.rightHand.getTransform().getWorldPosition();
        var boxPosition =  this.getTransform().getWorldPosition();

        var distanceToLeftHand = leftHandPosition.distance(boxPosition);
        var distanceToRightHand = rightHandPosition.distance(boxPosition);
        
        if (distanceToLeftHand <= this.distanceTriggerThreshold 
            || distanceToRightHand <= this.distanceTriggerThreshold)
        {
             this.onTriggered();
        }
    }

    private onTriggered()
    {
        if (!this.onTriggeredCallback)
        {
            return;
        }

        this.isTriggered = true;
        this.onTriggeredCallback();
    }
}