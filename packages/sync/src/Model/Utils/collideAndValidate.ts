import { RoleType, ScopeType } from '../../Policy/Types';
import { Options } from '../../Common/Types';
import { ValidatorResult } from '../../Validate/Types';
import { Model } from '../Types';
import { Collision } from '../../Interact';

/**
 * @param model
 * @param roles
 * @param scope
 * @param values
 * @param options
 */
const collideAndValidate = ({
  model,
  roles,
  scope,
  values,
  options,
}: {
  model: Model;
  roles: RoleType[];
  scope: ScopeType[];
  values: any;
  options: Options;
}): { valid: boolean; results: { [s: string]: ValidatorResult } } => {
  // Create a new collision instance
  const collision = Collision({
    model,
    scope,
    roles,
    options,
  });
  // Collide with the provided data
  collision.with(values).collide();
  // Run the data through sanitizers
  collision.sanitize(options);
  // Validate the data and return the result
  return collision.validate(options);
};

export default collideAndValidate;
