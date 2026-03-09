export interface SourceOfIncomeData {
  name: string;
  code: string;
  identity: string;

}

export interface SourceOfIncomeFormData 
extends Record<string,unknown>{
  name: string;
  code: string;


}
export interface SourceOfIncomeResponseFormData {
  name: string;
  code: string;
  identity: string;
}
