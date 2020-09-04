import * as casbin from 'casbin';
export declare function getCasbinEnforcerByName(name: string): Promise<casbin.Enforcer | undefined>;
export declare function createEnforcerByRole(policyPath: string): Promise<casbin.Enforcer>;
