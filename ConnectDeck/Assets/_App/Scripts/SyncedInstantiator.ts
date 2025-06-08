import { Instantiator } from "SpectaclesSyncKit.lspkg/Components/Instantiator"
import { NetworkRootInfo } from "SpectaclesSyncKit.lspkg/Core/NetworkRootInfo";
import { SyncKitLogger } from "SpectaclesSyncKit.lspkg/Utils/SyncKitLogger"
import { HeaderIceBreaker } from "./HeaderIceBreaker";

@component
export class SyncedInstantiator extends BaseScriptComponent {
    
    private readonly log: SyncKitLogger = new SyncKitLogger
    (
        SyncedInstantiator.name
    );

    @input() instantiator: Instantiator
    @input() iceBreakerPrefab: ObjectPrefab

    private iceBreakerString: string;
    
    constructor()
    {
        super();
        this.enabled = false;
    }

    public instantiateSyncedObject()
    {
        this.enabled = true;
    }

    onAwake() 
    {
        this.instantiator.notifyOnReady(() => {
            this.onInstantiatorReady();
        });
    }

    private onInstantiatorReady() : void
    {
        this.instantiator.instantiate(this.iceBreakerPrefab, null, this.onIceBreakerInstantiated);
    }

    private onIceBreakerInstantiated(networkRoot:NetworkRootInfo)
    {
        var obj = networkRoot.instantiatedObject;
        var headerIceBreaker = obj.getComponent('ScriptComponent') as HeaderIceBreaker;
        headerIceBreaker.setup(this.iceBreakerString);
    }

    public setup(iceBreakerString:string)
    {
        this.iceBreakerString = iceBreakerString;
    }
}