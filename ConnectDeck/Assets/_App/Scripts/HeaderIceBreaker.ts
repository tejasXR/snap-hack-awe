import { SyncTransform } from "SpectaclesSyncKit.lspkg/Components/SyncTransform";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider"
import { SessionController } from "SpectaclesSyncKit.lspkg/Core/SessionController";

@component
export class HeaderIceBreaker extends BaseScriptComponent {
    
    @input iceBreakerDetail: Text;
    @input("float", "10") distanceAboveHead:number;

    constructor()
    {
        super();    
        this.createEvent('UpdateEvent').bind(() => {
            this.onUpdate();
        })
    }

    private onUpdate()
    {
        if (!SessionController)
        {
            return;
        }

        if (!SessionController.getInstance().isColocated)
        {
            return;
        }

        if (!SessionController.getInstance().isLocalUserConnection)
        {
            return;
        }

        var camera = SessionController.getInstance().deviceTrackingComponent. getTransform();
        
        var headPosition = camera.getWorldPosition();
        var yAddition = new vec3(0, this.distanceAboveHead, 0);
        var destPosition = headPosition.add(yAddition);
        this.getTransform().setWorldPosition(destPosition);
    }

    public setup(iceBreakerStatement:string)
    {
        this.iceBreakerDetail.text = iceBreakerStatement;
    }
}