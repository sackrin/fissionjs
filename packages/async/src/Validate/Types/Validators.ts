import { ValidatorResult, ValidatorValidateArgs, ValidatorsType } from "./index";

export interface Validators {
  validators: ValidatorsType;
  options: any;
  merge(additional: ValidatorsType): void;
  validate({
    effect,
    options
  }: ValidatorValidateArgs): Promise<ValidatorResult>;
}

export default Validators;
