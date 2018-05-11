import assert from 'assert';
import { ValidatorGroup } from '../ValidatorGroup';
import { SimpleValidator } from '../SimpleValidator';

describe.only('Validator Group', () => {
  const simpleValidators = [
    new SimpleValidator({ rules: 'required' }),
    new SimpleValidator({ rules: 'min:5' })
  ];

  it('can create a simple validator group', () => {
    const validatorGroup = new ValidatorGroup({ validators: simpleValidators, test: true });
    assert.deepEqual(validatorGroup.validators, simpleValidators);
    assert.equal(validatorGroup.options.test, true);
  });

  it('can perform validation on a value and pass', () => {
    const validatorGroup = new ValidatorGroup({ validators: simpleValidators });
    return validatorGroup.validate({ value: 'johnny' })
      .then(({ result, messages }) => {
        assert.equal(result, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => { throw new Error(msg); });
  });
});
