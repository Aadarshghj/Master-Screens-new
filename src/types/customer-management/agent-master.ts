export interface AgentMasterType {
  agentName: string;
  agentCode: string;
  address: string;
  contactNumber: string;
  identity: string;
}

export interface AgentMasterRequestDto {
  agentName: string;
  agentCode: string;
  address: string;
  contactNumber: string;
}

export interface AgentMasterResponeDto {
  agentId: string;
  agentName: string;
  agentCode: string;
  address: string;
  contactNumber: string;
  identity: string;
}
