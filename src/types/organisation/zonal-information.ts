export interface ZoneDetails {
  zonecode: string;
  zonename: string;
  zoneshortname: string;
  status: string;
  adminunittype: string;
  parentzone: number | null;
  zonetype: string;
  categoryid: string;

  registrationdate: Date | null;
  openingdate: Date | null;
  closingdate: Date | null;
  dateofshift: Date | null;
  mergedon: Date | null;
  mergedto: string;

  basecurrency: string;
  language: string;
  mainzone: boolean;

  doornumber: string;
  addressline1: string;
  addressline2: string;
  landmark: string;
  placename: string;
  pincode: string;
  postoffice: string;
  city: string;
  country: string;
  state: string;
  district: string;
  timezone: string;
  latitude: string;
  longitude: string;
}

export interface ZoneDetailsDto {
  zonecode: string;
  zonename: string;
  zoneshortname: string;
  status: string;
  adminunittype: string;
  parentzone: number | null;
  zonetype: string;
  categoryid: string;

  registrationdate: string | null;
  openingdate: string | null;
  closingdate: string | null;
  dateofshift: string | null;
  mergedon: string | null;

  mergedto: string;
  basecurrency: string;
  language: string;
  mainzone: boolean;

  doornumber: string | null;
  addressline1: string;
  addressline2: string;
  landmark: string;
  placename: string;
  pincode: string;
  postoffice: string;
  city: string;
  country: string;
  state: string;
  district: string;
  timezone: string;
  latitude: string;
  longitude: string;
}

export interface ZoneTableRow {
  zonecode: string;
  zonename: string;
  adminunittype: string;
  parentzone: string;
  zonetype: string;
  mainzone: boolean;
}
