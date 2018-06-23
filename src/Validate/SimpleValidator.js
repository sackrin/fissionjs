import _ from 'lodash';
import { buildRules } from './utils';
import Validator from 'validatorjs';

export type ValidationResult = { result: boolean, messages: Array<string> };

export type SimpleValidatorArgs = {
  rules: Array<string | Function>
};

export class SimpleValidator {
  rules: Array<string | Function>;

  options: Object;

  constructor ({ rules, ...options }: SimpleValidatorArgs) {
    this.rules = rules;
    this.options = options;
  }

  getRules = async ({ ...options }: Object = {}): Promise<string> => {
    return buildRules(this.rules, { validator: this.options, ...options })
      .then(builtRules => (builtRules.join('|')));
  };

  validate = async ({ value, ...options }: { value:any }): Promise<ValidationResult> => {
    const usingRules: string = await this.getRules({ options: options });
    const usingValue: any = !_.isFunction(value) ? value : await value({ ...this.options, ...options });
    const validation = new Validator({ value: usingValue }, { value: usingRules });
    if (validation.fails()) {
      return { result: false, messages: [...validation.errors.get('value'), ..._.get(this.options, 'error_messages', [])] };
    } else {
      return { result: true, messages: [..._.get(this.options, 'success_messages', [])] };
    }
  };
}

export default (args: SimpleValidatorArgs): SimpleValidator => (new SimpleValidator(args));
