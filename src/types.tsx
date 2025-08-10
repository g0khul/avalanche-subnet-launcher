export interface Validator {
  node_id: string;
  stake_amount: string;
  stake_start_time: string;
  stake_end_time: string;
  reward_address: string;
}

export interface SubnetFormData {
  chain_name: string;
  chain_id: string;
  token_name: string;
  token_symbol: string;
  initial_token_supply: string;
  token_decimal_precision: string;
  block_time: string;
  gas_limit_per_block: string;
  validators: Validator[];
  network_type: string;
  contract_names: string[];
  contract_files: File[];
  constructor_args: string;
  special_transaction_fees: string;
}
