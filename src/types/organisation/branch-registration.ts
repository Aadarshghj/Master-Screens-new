export interface BranchDetails {
  branchcode: string;
  branchname: string;
  branchshortname: string;
  status: string;
  adminunittype: string;
  parentbranch: string;
  branchtype: string;
  categoryid: string;

  registrationdate: Date | null;
  openingdate: Date | null;
  closingdate: Date | null;
  dateofshift: Date | null;
  mergedon: Date | null;
  mergedto: string;
  basecurrency: string;
  language: string;
  mainbranch: boolean;

  doornumber: string | null;
  addressline1: string;
  addressline2: string;
  landmark: string;
  placename: string;
  pincode: number | null;
  postoffice: string;
  city: string;
  country: string;
  state: string;
  district: string;
  timezone: string;
  latitude: string;
  longitued: string;
}
export interface BranchDetailsDto {
  branchcode: string;
  branchname: string;
  branchshortname: string;
  status: string;
  adminunittype: string;
  parentbranch: string;
  branchtype: string;
  categoryid: string;

  registrationdate: Date | null;
  openingdate: Date | null;
  closingdate: Date | null;
  dateofshift: Date | null;
  mergedon: Date | null;
  mergedto: string;
  basecurrency: string;
  language: string;
  mainbranch: boolean;

  doornumber: string | null;
  addressline1: string;
  addressline2: string;
  landmark: string;
  placename: string;
  pincode: number | null;
  postoffice: string;
  city: string;
  country: string;
  state: string;
  district: string;
  timezone: string;
  latitude: string;
  longitued: string;
}
