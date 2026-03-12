export const LoanAssetClassifiApi= {
    save: () => "/api/v1/master/asset-classification",
    get:()=> "/api/v1/master/asset-classification",
    delete:(identity:string)=>`/api/v1/master/asset-classification/${identity}`,
    update:(identity:string)=>`/api/v1/master/asset-classification/${identity}`,
    
}