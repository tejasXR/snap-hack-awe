import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import { Instantiator } from "SpectaclesSyncKit.lspkg/Components/Instantiator"
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { SyncedInstantiator } from "_App/Scripts/SyncedInstantiator"


@component
export class SessionConnector extends BaseScriptComponent {
    
    @input sendConnectionButton: Interactable;
    @input connectOnStart: boolean;
    @input enableOnConnected: SceneObject;
    @input syncedInstantiator: SyncedInstantiator;
    // @input instantiatorParent: SceneObject;
    // @input wayfinderObject: SceneObject;
        
    constructor()
    {
        super();

        this.createEvent("OnStartEvent").bind(() => this.onStart());
        this.createEvent("UpdateEvent").bind(() => this.onUpdate());
    }
    
 private onStart() {

        SessionController.getInstance().onConnectionFailed.add(()=> {
            print("WARNING: Connection Failed");
        })

        SessionController.getInstance().onConnected.add(()=> 
        {
            this.enableOnConnected.enabled = true;
            print("Session is connected!");
        });

        this.sendConnectionButton.onTriggerStart.add(() => this.startConnectedSession())

        if (this.connectOnStart)
        {
            this.startConnectedSession();
        }
    }

    private startConnectedSession()
    {
        // this.sendConnectionButton.getSceneObject().enabled = false;
        SessionController.getInstance().init();
        this.syncedInstantiator.instantiateSyncedObject();

        // SessionController.getInstance().setColocatedBuildStatus(ColocatedBuildStatus.None);
        // SessionController.getInstance().setColocatedMapId("");
    }

    private stopConnectedSession(){
        // Need to stop session
    }

    private onUpdate()
    {
        // if (this.instantiatorParent.getChildrenCount() >= 1)
        // {
        //     var childObjectTransform = this.instantiatorParent.children[0].getTransform();
        //     var targtPos = childObjectTransform.getWorldPosition();
        //     var originPos = this.wayfinderObject.getTransform().getWorldPosition();

        //     var angleToMove = originPos.angleTo(targtPos)
        //     var directionVec = originPos.rotateTowards(targtPos, angleToMove);

        //     // var wayfinderDirection = this.wayfinderObject
        //             // .getTransform()
        //             // .getWorldPosition()
        //             // .rotateTowards(this.instantiatedPosition, 3.14);

        //     // var angleToMove = this.instantiatedPosition.normalize - this.wayfinderObject.getTransform().getWorldPosition().normalize;

        //     print(directionVec);
        //     this.wayfinderObject.getTransform().setWorldRotation(quat.fromEulerVec(directionVec));
        // }
    }
}
