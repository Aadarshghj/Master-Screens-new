export const riskAssessmentType= {
    save: () => "/api/v1/master/risk-assessment-details",
    get:()=> "/api/v1/master/risk-assessment-details",
    delete:(identity:string)=>`/api/v1/master/risk-assessment-details/${identity}`,
    update:(identity:string)=>`/api/v1/master/risk-assessment-details/${identity}`,
    // getbyid:(identity:string)=>`/api/v1/master/risk-assessment-details/${identity}`,
}