import _ from "lodash";
import { getMixedResult } from "../Utils";
import { Policy, PolicyArgs, PolicyGrantArgs, RolesType, ScopesType } from "./Types";

/**
 * Use this policy to implicitly grant against roles and scope.
 * ie. new Allow({ roles: ["user", "admin"], scope: ["read", "write"] })
 * You should always define policies while creating your atom schema
 * Should be used within a Policies instance.
 * Use the grant method in order to grant against a provided set of roles, scope and isotope
 */
export class Allow implements Policy {
  public roles: RolesType = [];

  public scope: ScopesType = [];

  public options: any = {};

  /**
   * @param {RoleType | RolesType} roles
   * @param {ScopeType | ScopesType} scope
   * @param {any} options
   */
  constructor({ roles, scope, options = {} }: PolicyArgs) {
    this.roles = _.isArray(roles) ? roles : [roles];
    this.scope = _.isArray(scope) ? scope : [scope];
    this.options = options;
  }

  /**
   * Get Constructed Roles
   * @param options
   * @returns {Promise<string[]>}
   */
  public getRoles = async (options: any = {}): Promise<string[]> => {
    return getMixedResult(this.roles, { ...this.options, ...options });
  };

  /**
   * Get Constructed Scope
   * @param options
   * @returns {Promise<string[]>}
   */
  public getScope = async (options: any = {}): Promise<string[]> => {
    return getMixedResult(this.scope, { ...this.options, ...options });
  };

  /**
   * Grant Challenge
   * @param {Isotope} isotope
   * @param {RoleType | RolesType} roles
   * @param {ScopeType | ScopesType} scope
   * @param {{options?: any} | any} options
   * @returns {Promise<boolean>}
   */
  public grant = async ({
    isotope,
    roles,
    scope,
    ...options
  }: PolicyGrantArgs): Promise<boolean> => {
    const forRoles: string[] = await getMixedResult(this.roles, options);
    const againstRoles: string[] = await getMixedResult(
      _.isArray(roles) ? roles : [roles],
      options
    );
    const roleCheck: string[] = _.difference(againstRoles, forRoles);
    if (
      roleCheck.length === againstRoles.length &&
      forRoles.indexOf("*") === -1
    ) {
      return false;
    }
    const forScopes: string[] = await getMixedResult(this.scope, options);
    const againstScopes: string[] = await getMixedResult(
      _.isArray(scope) ? scope : [scope],
      options
    );
    const scopeCheck: string[] = _.difference(againstScopes, forScopes);
    return !(
      scopeCheck.length === againstScopes.length &&
      forScopes.indexOf("*") === -1
    );
  };
}

/**
 * This is the typical way to create a new policy.
 * Should be used in favour of using the primary policy class
 * @param {PolicyArgs} args
 * @returns {Allow}
 */
export default (args: PolicyArgs): Allow => new Allow(args);