@component
export class CardData extends BaseScriptComponent {
    
    @input cardName: Material;
    @input cardFace: Material;
    @input cardMinimized: Material;
    @input details: string;
    @input iceBreaker: string;
    @input headerIceBreaker: string;
}