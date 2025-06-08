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

    iceBreakerString: string;
    header: HeaderIceBreaker;  

    public instantiateSyncedObject()
    {
        print("when object is instantiated, string value is" + this.iceBreakerString)

         this.instantiator.notifyOnReady(() => {
            this.onInstantiatorReady();
        });
    }

    private onInstantiatorReady()
    {
        this.instantiator.instantiate(this.iceBreakerPrefab, null, (networkRoot) => this.onIceBreakerInstantiated(networkRoot));
    }

    private onIceBreakerInstantiated(networkRoot:NetworkRootInfo)
    {
        var obj = networkRoot.instantiatedObject;
        this.header = obj.getComponent('ScriptComponent') as HeaderIceBreaker;
        this.header.setup(this.iceBreakerString);   
    }

    // setupHeader()
    // {
    //     print("current ice breaker name " + this.iceBreakerString);

    //     this.iceBreakerString = "";

       
    // }

    public setup(iceBreakerString:string)
    {
        this.iceBreakerString = iceBreakerString;
    }


}