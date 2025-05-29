import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import {SessionController} from "SpectaclesSyncKit.lspkg/Core/SessionController"
import {Instantiator} from "SpectaclesSyncKit.lspkg/Components/Instantiator"

@component
export class NewScript extends BaseScriptComponent {
    
    @input connectOnStart: boolean;
    @input enableOnConnected: SceneObject;
    @input instantiator: Instantiator;
    @input instantiatorParent: SceneObject;
    @input wayfinderObject: SceneObject;
    
    private instantiatedPosition: vec3;
    
    constructor(){
        super()

        this.createEvent("OnStartEvent").bind(() => this.onStart())
        this.createEvent("UpdateEvent").bind(() => this.onUpdate())
    }
    
 private onStart() {

        SessionController.getInstance().onConnectionFailed.add(()=> {
            print("WARNING: Connection Failed");
        })

        SessionController.getInstance().onConnected.add(()=> {
            this.enableOnConnected.enabled = true;
            print("Session is connected!");
        });

        if (this.connectOnStart)
        {
            this.startConnectedSession();
        }
    }

    private startConnectedSession(){
        SessionController.getInstance().init();
    }

    private stopConnectedSession(){
        // Need to stop session
    }

    private onUpdate(){

        print(this.instantiatorParent.getChildrenCount());

        if (this.instantiatorParent.getChildrenCount() >= 1)
        {
            var childObjectTransform = this.instantiatorParent.children[0].getTransform();
            var targtPos = childObjectTransform.getWorldPosition();
            var originPos = this.wayfinderObject.getTransform().getWorldPosition();

            var angleToMove = originPos.angleTo(targtPos)
            var directionVec = originPos.rotateTowards(targtPos, angleToMove);

            // var wayfinderDirection = this.wayfinderObject
                    // .getTransform()
                    // .getWorldPosition()
                    // .rotateTowards(this.instantiatedPosition, 3.14);

            // var angleToMove = this.instantiatedPosition.normalize - this.wayfinderObject.getTransform().getWorldPosition().normalize;

            print(directionVec);
            this.wayfinderObject.getTransform().setWorldRotation(quat.fromEulerVec(directionVec));
        }
    }
}
