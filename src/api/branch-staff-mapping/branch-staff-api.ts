export const BranchStaffMapping= {
    save: () => "/api/v1/master/branch-staff-mapping",
    get:()=> "/api/v1/master/branch-staff-mapping",
    delete:(identity:string)=>`/api/v1/master/branch-staff-mapping/${identity}`,
    update:(identity:string)=>`/api/v1/master/branch-staff-mapping/${identity}`,
    getallstaff:()=>"/api/v1/master/staff",
    getallbranch:()=>"/api/v1/master/branches",
    getassignedstaff:(branchIdentity:string)=>`/api/v1/master/branch-staff-mapping/${branchIdentity}/branch`
}