import * as BabelCore from '@babel/core';
import { NodePath as NodePath$1 } from '@babel/core';
import * as t from '@babel/types';
import { z } from 'zod';
import { NodePath, Scope } from '@babel/traverse';

interface Result<T, E> {
    map<U>(fn: (val: T) => U): Result<U, E>;
    mapErr<F>(fn: (val: E) => F): Result<T, F>;
    mapOr<U>(fallback: U, fn: (val: T) => U): U;
    mapOrElse<U>(fallback: () => U, fn: (val: T) => U): U;
    andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E>;
    and<U>(res: Result<U, E>): Result<U, E>;
    or(res: Result<T, E>): Result<T, E>;
    orElse<F>(fn: (val: E) => Result<T, F>): Result<T, F>;
    isOk(): this is OkImpl<T>;
    isErr(): this is ErrImpl<E>;
    expect(msg: string): T;
    expectErr(msg: string): E;
    unwrap(): T;
    unwrapOr(fallback: T): T;
    unwrapOrElse(fallback: (val: E) => T): T;
    unwrapErr(): E;
}
declare class OkImpl<T> implements Result<T, never> {
    #private;
    constructor(val: T);
    map<U>(fn: (val: T) => U): Result<U, never>;
    mapErr<F>(_fn: (val: never) => F): Result<T, F>;
    mapOr<U>(_fallback: U, fn: (val: T) => U): U;
    mapOrElse<U>(_fallback: () => U, fn: (val: T) => U): U;
    andThen<U>(fn: (val: T) => Result<U, never>): Result<U, never>;
    and<U>(res: Result<U, never>): Result<U, never>;
    or(_res: Result<T, never>): Result<T, never>;
    orElse<F>(_fn: (val: never) => Result<T, F>): Result<T, F>;
    isOk(): this is OkImpl<T>;
    isErr(): this is ErrImpl<never>;
    expect(_msg: string): T;
    expectErr(msg: string): never;
    unwrap(): T;
    unwrapOr(_fallback: T): T;
    unwrapOrElse(_fallback: (val: never) => T): T;
    unwrapErr(): never;
}
declare class ErrImpl<E> implements Result<never, E> {
    #private;
    constructor(val: E);
    map<U>(_fn: (val: never) => U): Result<U, E>;
    mapErr<F>(fn: (val: E) => F): Result<never, F>;
    mapOr<U>(fallback: U, _fn: (val: never) => U): U;
    mapOrElse<U>(fallback: () => U, _fn: (val: never) => U): U;
    andThen<U>(_fn: (val: never) => Result<U, E>): Result<U, E>;
    and<U>(_res: Result<U, E>): Result<U, E>;
    or(res: Result<never, E>): Result<never, E>;
    orElse<F>(fn: (val: E) => ErrImpl<F>): Result<never, F>;
    isOk(): this is OkImpl<never>;
    isErr(): this is ErrImpl<E>;
    expect(msg: string): never;
    expectErr(_msg: string): E;
    unwrap(): never;
    unwrapOr<T>(fallback: T): T;
    unwrapOrElse<T>(fallback: (val: E) => T): T;
    unwrapErr(): E;
}

type AliasingEffect = {
    kind: 'Freeze';
    value: Place;
    reason: ValueReason;
} | {
    kind: 'Mutate';
    value: Place;
    reason?: MutationReason | null;
} | {
    kind: 'MutateConditionally';
    value: Place;
} | {
    kind: 'MutateTransitive';
    value: Place;
} | {
    kind: 'MutateTransitiveConditionally';
    value: Place;
} | {
    kind: 'Capture';
    from: Place;
    into: Place;
} | {
    kind: 'Alias';
    from: Place;
    into: Place;
} | {
    kind: 'MaybeAlias';
    from: Place;
    into: Place;
} | {
    kind: 'Assign';
    from: Place;
    into: Place;
} | {
    kind: 'Create';
    into: Place;
    value: ValueKind;
    reason: ValueReason;
} | {
    kind: 'CreateFrom';
    from: Place;
    into: Place;
} | {
    kind: 'ImmutableCapture';
    from: Place;
    into: Place;
} | {
    kind: 'Apply';
    receiver: Place;
    function: Place;
    mutatesFunction: boolean;
    args: Array<Place | SpreadPattern | Hole>;
    into: Place;
    signature: FunctionSignature | null;
    loc: SourceLocation;
} | {
    kind: 'CreateFunction';
    captures: Array<Place>;
    function: FunctionExpression | ObjectMethod;
    into: Place;
} | {
    kind: 'MutateFrozen';
    place: Place;
    error: CompilerDiagnostic;
} | {
    kind: 'MutateGlobal';
    place: Place;
    error: CompilerDiagnostic;
} | {
    kind: 'Impure';
    place: Place;
    error: CompilerDiagnostic;
} | {
    kind: 'Render';
    place: Place;
};
type MutationReason = {
    kind: 'AssignCurrentProperty';
};
type AliasingSignature = {
    receiver: IdentifierId;
    params: Array<IdentifierId>;
    rest: IdentifierId | null;
    returns: IdentifierId;
    effects: Array<AliasingEffect>;
    temporaries: Array<Place>;
};

type BuiltInType = PrimitiveType | FunctionType | ObjectType;
type Type = BuiltInType | PhiType | TypeVar | PolyType | PropType | ObjectMethod$1;
type PrimitiveType = {
    kind: 'Primitive';
};
type FunctionType = {
    kind: 'Function';
    shapeId: string | null;
    return: Type;
    isConstructor: boolean;
};
type ObjectType = {
    kind: 'Object';
    shapeId: string | null;
};
type TypeVar = {
    kind: 'Type';
    id: TypeId;
};
type PolyType = {
    kind: 'Poly';
};
type PhiType = {
    kind: 'Phi';
    operands: Array<Type>;
};
type PropType = {
    kind: 'Property';
    objectType: Type;
    objectName: string;
    propertyName: {
        kind: 'literal';
        value: PropertyLiteral;
    } | {
        kind: 'computed';
        value: Type;
    };
};
type ObjectMethod$1 = {
    kind: 'ObjectMethod';
};
declare const opaqueTypeId: unique symbol;
type TypeId = number & {
    [opaqueTypeId]: 'IdentifierId';
};

type HookKind = 'useContext' | 'useState' | 'useActionState' | 'useReducer' | 'useRef' | 'useEffect' | 'useLayoutEffect' | 'useInsertionEffect' | 'useMemo' | 'useCallback' | 'useTransition' | 'useImperativeHandle' | 'useEffectEvent' | 'Custom';
type FunctionSignature = {
    positionalParams: Array<Effect>;
    restParam: Effect | null;
    returnType: BuiltInType | PolyType;
    returnValueKind: ValueKind;
    returnValueReason?: ValueReason;
    calleeEffect: Effect;
    hookKind: HookKind | null;
    noAlias?: boolean;
    mutableOnlyIfOperandsAreMutable?: boolean;
    impure?: boolean;
    knownIncompatible?: string | null | undefined;
    canonicalName?: string;
    aliasing?: AliasingSignature | null | undefined;
};

type Global = BuiltInType | PolyType;

type ResolvedType = {
    kind: 'Concrete';
    type: ConcreteType<ResolvedType>;
    platform: Platform;
};
type ComponentType<T> = {
    kind: 'Component';
    props: Map<string, T>;
    children: null | T;
};
type ConcreteType<T> = {
    kind: 'Enum';
} | {
    kind: 'Mixed';
} | {
    kind: 'Number';
} | {
    kind: 'String';
} | {
    kind: 'Boolean';
} | {
    kind: 'Void';
} | {
    kind: 'Nullable';
    type: T;
} | {
    kind: 'Array';
    element: T;
} | {
    kind: 'Set';
    element: T;
} | {
    kind: 'Map';
    key: T;
    value: T;
} | {
    kind: 'Function';
    typeParameters: null | Array<TypeParameter<T>>;
    params: Array<T>;
    returnType: T;
} | ComponentType<T> | {
    kind: 'Generic';
    id: TypeParameterId;
    bound: T;
} | {
    kind: 'Object';
    id: NominalId;
    members: Map<string, ResolvedType>;
} | {
    kind: 'Tuple';
    id: NominalId;
    members: Array<T>;
} | {
    kind: 'Structural';
    id: LinearId;
} | {
    kind: 'Union';
    members: Array<T>;
} | {
    kind: 'Instance';
    name: string;
    members: Map<string, ResolvedType>;
};
type TypeParameter<T> = {
    name: string;
    id: TypeParameterId;
    bound: T;
};
declare const opaqueLinearId: unique symbol;
type LinearId = number & {
    [opaqueLinearId]: 'LinearId';
};
declare const opaqueTypeParameterId: unique symbol;
type TypeParameterId = number & {
    [opaqueTypeParameterId]: 'TypeParameterId';
};
declare const opaqueNominalId: unique symbol;
type NominalId = number & {
    [opaqueNominalId]: 'NominalId';
};
type Platform = 'client' | 'server' | 'shared';
interface ITypeEnv {
    popGeneric(name: string): void;
    getGeneric(name: string): null | TypeParameter<ResolvedType>;
    pushGeneric(name: string, binding: {
        name: string;
        id: TypeParameterId;
        bound: ResolvedType;
    }): void;
    getType(id: Identifier): ResolvedType;
    getTypeOrNull(id: Identifier): ResolvedType | null;
    setType(id: Identifier, type: ResolvedType): void;
    nextNominalId(): NominalId;
    nextTypeParameterId(): TypeParameterId;
    moduleEnv: Map<string, ResolvedType>;
    addBinding(bindingIdentifier: t.Identifier, type: ResolvedType): void;
    resolveBinding(bindingIdentifier: t.Identifier): ResolvedType | null;
}
declare class FlowTypeEnv implements ITypeEnv {
    #private;
    moduleEnv: Map<string, ResolvedType>;
    init(env: Environment, source: string): void;
    setType(identifier: Identifier, type: ResolvedType): void;
    getType(identifier: Identifier): ResolvedType;
    getTypeOrNull(identifier: Identifier): ResolvedType | null;
    getTypeByLoc(loc: SourceLocation): ResolvedType | null;
    nextNominalId(): NominalId;
    nextTypeParameterId(): TypeParameterId;
    addBinding(bindingIdentifier: t.Identifier, type: ResolvedType): void;
    resolveBinding(bindingIdentifier: t.Identifier): ResolvedType | null;
    pushGeneric(name: string, generic: TypeParameter<ResolvedType>): void;
    popGeneric(name: string): void;
    getGeneric(name: string): null | TypeParameter<ResolvedType>;
}

declare const ExternalFunctionSchema: z.ZodObject<{
    source: z.ZodString;
    importSpecifierName: z.ZodString;
}, z.core.$strip>;
type ExternalFunction = z.infer<typeof ExternalFunctionSchema>;
type CompilerMode = 'all_features' | 'no_inferred_memo';
declare const HookSchema: z.ZodObject<{
    effectKind: z.ZodEnum<typeof Effect>;
    valueKind: z.ZodEnum<typeof ValueKind>;
    noAlias: z.ZodDefault<z.ZodBoolean>;
    transitiveMixedData: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
type Hook = z.infer<typeof HookSchema>;
declare const EnvironmentConfigSchema: z.ZodObject<{
    customHooks: z.ZodDefault<z.ZodMap<z.ZodString, z.ZodObject<{
        effectKind: z.ZodEnum<typeof Effect>;
        valueKind: z.ZodEnum<typeof ValueKind>;
        noAlias: z.ZodDefault<z.ZodBoolean>;
        transitiveMixedData: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    moduleTypeProvider: z.ZodDefault<z.ZodNullable<z.ZodAny>>;
    customMacros: z.ZodDefault<z.ZodNullable<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodTuple<[z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"wildcard">;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"name">;
        name: z.ZodString;
    }, z.core.$strip>]>>], null>]>>>>;
    enableResetCacheOnSourceFileChanges: z.ZodDefault<z.ZodNullable<z.ZodBoolean>>;
    enablePreserveExistingMemoizationGuarantees: z.ZodDefault<z.ZodBoolean>;
    validatePreserveExistingMemoizationGuarantees: z.ZodDefault<z.ZodBoolean>;
    enablePreserveExistingManualUseMemo: z.ZodDefault<z.ZodBoolean>;
    enableForest: z.ZodDefault<z.ZodBoolean>;
    enableUseTypeAnnotations: z.ZodDefault<z.ZodBoolean>;
    flowTypeProvider: z.ZodDefault<z.ZodNullable<z.ZodAny>>;
    enableOptionalDependencies: z.ZodDefault<z.ZodBoolean>;
    enableFire: z.ZodDefault<z.ZodBoolean>;
    enableNameAnonymousFunctions: z.ZodDefault<z.ZodBoolean>;
    inferEffectDependencies: z.ZodDefault<z.ZodNullable<z.ZodArray<z.ZodObject<{
        function: z.ZodObject<{
            source: z.ZodString;
            importSpecifierName: z.ZodString;
        }, z.core.$strip>;
        autodepsIndex: z.ZodNumber;
    }, z.core.$strip>>>>;
    inlineJsxTransform: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        elementSymbol: z.ZodUnion<readonly [z.ZodLiteral<"react.element">, z.ZodLiteral<"react.transitional.element">]>;
        globalDevVar: z.ZodString;
    }, z.core.$strip>>>;
    validateHooksUsage: z.ZodDefault<z.ZodBoolean>;
    validateRefAccessDuringRender: z.ZodDefault<z.ZodBoolean>;
    validateNoSetStateInRender: z.ZodDefault<z.ZodBoolean>;
    validateNoSetStateInEffects: z.ZodDefault<z.ZodBoolean>;
    validateNoDerivedComputationsInEffects: z.ZodDefault<z.ZodBoolean>;
    validateNoJSXInTryStatements: z.ZodDefault<z.ZodBoolean>;
    validateStaticComponents: z.ZodDefault<z.ZodBoolean>;
    validateMemoizedEffectDependencies: z.ZodDefault<z.ZodBoolean>;
    validateNoCapitalizedCalls: z.ZodDefault<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    validateBlocklistedImports: z.ZodDefault<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    validateNoImpureFunctionsInRender: z.ZodDefault<z.ZodBoolean>;
    validateNoFreezingKnownMutableFunctions: z.ZodDefault<z.ZodBoolean>;
    enableAssumeHooksFollowRulesOfReact: z.ZodDefault<z.ZodBoolean>;
    enableTransitivelyFreezeFunctionExpressions: z.ZodDefault<z.ZodBoolean>;
    enableEmitFreeze: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        source: z.ZodString;
        importSpecifierName: z.ZodString;
    }, z.core.$strip>>>;
    enableEmitHookGuards: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        source: z.ZodString;
        importSpecifierName: z.ZodString;
    }, z.core.$strip>>>;
    enableInstructionReordering: z.ZodDefault<z.ZodBoolean>;
    enableFunctionOutlining: z.ZodDefault<z.ZodBoolean>;
    enableJsxOutlining: z.ZodDefault<z.ZodBoolean>;
    enableEmitInstrumentForget: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        fn: z.ZodObject<{
            source: z.ZodString;
            importSpecifierName: z.ZodString;
        }, z.core.$strip>;
        gating: z.ZodNullable<z.ZodObject<{
            source: z.ZodString;
            importSpecifierName: z.ZodString;
        }, z.core.$strip>>;
        globalGating: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
    assertValidMutableRanges: z.ZodDefault<z.ZodBoolean>;
    enableChangeVariableCodegen: z.ZodDefault<z.ZodBoolean>;
    enableMemoizationComments: z.ZodDefault<z.ZodBoolean>;
    throwUnknownException__testonly: z.ZodDefault<z.ZodBoolean>;
    enableTreatFunctionDepsAsConditional: z.ZodDefault<z.ZodBoolean>;
    disableMemoizationForDebugging: z.ZodDefault<z.ZodBoolean>;
    enableChangeDetectionForDebugging: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        source: z.ZodString;
        importSpecifierName: z.ZodString;
    }, z.core.$strip>>>;
    enableCustomTypeDefinitionForReanimated: z.ZodDefault<z.ZodBoolean>;
    hookPattern: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    enableTreatRefLikeIdentifiersAsRefs: z.ZodDefault<z.ZodBoolean>;
    enableTreatSetIdentifiersAsStateSetters: z.ZodDefault<z.ZodBoolean>;
    lowerContextAccess: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        source: z.ZodString;
        importSpecifierName: z.ZodString;
    }, z.core.$strip>>>;
    validateNoVoidUseMemo: z.ZodDefault<z.ZodBoolean>;
    validateNoDynamicallyCreatedComponentsOrHooks: z.ZodDefault<z.ZodBoolean>;
    enableAllowSetStateFromRefsInEffects: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;
type PartialEnvironmentConfig = Partial<EnvironmentConfig>;
type ReactFunctionType = 'Component' | 'Hook' | 'Other';
declare class Environment {
    #private;
    logger: Logger | null;
    filename: string | null;
    code: string | null;
    config: EnvironmentConfig;
    fnType: ReactFunctionType;
    compilerMode: CompilerMode;
    programContext: ProgramContext;
    hasFireRewrite: boolean;
    hasInferredEffect: boolean;
    inferredEffectLocations: Set<SourceLocation>;
    parentFunction: NodePath<t.Function>;
    constructor(scope: Scope, fnType: ReactFunctionType, compilerMode: CompilerMode, config: EnvironmentConfig, contextIdentifiers: Set<t.Identifier>, parentFunction: NodePath<t.Function>, logger: Logger | null, filename: string | null, code: string | null, programContext: ProgramContext);
    get typeContext(): FlowTypeEnv;
    get isInferredMemoEnabled(): boolean;
    get nextIdentifierId(): IdentifierId;
    get nextBlockId(): BlockId;
    get nextScopeId(): ScopeId;
    get scope(): Scope;
    logErrors(errors: Result<void, CompilerError>): void;
    isContextIdentifier(node: t.Identifier): boolean;
    isHoistedIdentifier(node: t.Identifier): boolean;
    generateGloballyUniqueIdentifierName(name: string | null): ValidatedIdentifier;
    outlineFunction(fn: HIRFunction, type: ReactFunctionType | null): void;
    getOutlinedFunctions(): Array<{
        fn: HIRFunction;
        type: ReactFunctionType | null;
    }>;
    getGlobalDeclaration(binding: NonLocalBinding, loc: SourceLocation): Global | null;
    static knownReactModules: ReadonlyArray<string>;
    getFallthroughPropertyType(receiver: Type, _property: Type): BuiltInType | PolyType | null;
    getPropertyType(receiver: Type, property: string | number): BuiltInType | PolyType | null;
    getFunctionSignature(type: FunctionType): FunctionSignature | null;
    addHoistedIdentifier(node: t.Identifier): void;
}
declare function validateEnvironmentConfig(partialConfig: PartialEnvironmentConfig): EnvironmentConfig;

declare const GeneratedSource: unique symbol;
type SourceLocation = t.SourceLocation | typeof GeneratedSource;
type ReactiveFunction = {
    loc: SourceLocation;
    id: ValidIdentifierName | null;
    nameHint: string | null;
    params: Array<Place | SpreadPattern>;
    generator: boolean;
    async: boolean;
    body: ReactiveBlock;
    env: Environment;
    directives: Array<string>;
};
type ReactiveScopeBlock = {
    kind: 'scope';
    scope: ReactiveScope;
    instructions: ReactiveBlock;
};
type PrunedReactiveScopeBlock = {
    kind: 'pruned-scope';
    scope: ReactiveScope;
    instructions: ReactiveBlock;
};
type ReactiveBlock = Array<ReactiveStatement>;
type ReactiveStatement = ReactiveInstructionStatement | ReactiveTerminalStatement | ReactiveScopeBlock | PrunedReactiveScopeBlock;
type ReactiveInstructionStatement = {
    kind: 'instruction';
    instruction: ReactiveInstruction;
};
type ReactiveTerminalStatement<Tterminal extends ReactiveTerminal = ReactiveTerminal> = {
    kind: 'terminal';
    terminal: Tterminal;
    label: {
        id: BlockId;
        implicit: boolean;
    } | null;
};
type ReactiveInstruction = {
    id: InstructionId;
    lvalue: Place | null;
    value: ReactiveValue;
    effects?: Array<AliasingEffect> | null;
    loc: SourceLocation;
};
type ReactiveValue = InstructionValue | ReactiveLogicalValue | ReactiveSequenceValue | ReactiveTernaryValue | ReactiveOptionalCallValue;
type ReactiveLogicalValue = {
    kind: 'LogicalExpression';
    operator: t.LogicalExpression['operator'];
    left: ReactiveValue;
    right: ReactiveValue;
    loc: SourceLocation;
};
type ReactiveTernaryValue = {
    kind: 'ConditionalExpression';
    test: ReactiveValue;
    consequent: ReactiveValue;
    alternate: ReactiveValue;
    loc: SourceLocation;
};
type ReactiveSequenceValue = {
    kind: 'SequenceExpression';
    instructions: Array<ReactiveInstruction>;
    id: InstructionId;
    value: ReactiveValue;
    loc: SourceLocation;
};
type ReactiveOptionalCallValue = {
    kind: 'OptionalExpression';
    id: InstructionId;
    value: ReactiveValue;
    optional: boolean;
    loc: SourceLocation;
};
type ReactiveTerminal = ReactiveBreakTerminal | ReactiveContinueTerminal | ReactiveReturnTerminal | ReactiveThrowTerminal | ReactiveSwitchTerminal | ReactiveDoWhileTerminal | ReactiveWhileTerminal | ReactiveForTerminal | ReactiveForOfTerminal | ReactiveForInTerminal | ReactiveIfTerminal | ReactiveLabelTerminal | ReactiveTryTerminal;
type ReactiveTerminalTargetKind = 'implicit' | 'labeled' | 'unlabeled';
type ReactiveBreakTerminal = {
    kind: 'break';
    target: BlockId;
    id: InstructionId;
    targetKind: ReactiveTerminalTargetKind;
    loc: SourceLocation;
};
type ReactiveContinueTerminal = {
    kind: 'continue';
    target: BlockId;
    id: InstructionId;
    targetKind: ReactiveTerminalTargetKind;
    loc: SourceLocation;
};
type ReactiveReturnTerminal = {
    kind: 'return';
    value: Place;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveThrowTerminal = {
    kind: 'throw';
    value: Place;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveSwitchTerminal = {
    kind: 'switch';
    test: Place;
    cases: Array<{
        test: Place | null;
        block: ReactiveBlock | void;
    }>;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveDoWhileTerminal = {
    kind: 'do-while';
    loop: ReactiveBlock;
    test: ReactiveValue;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveWhileTerminal = {
    kind: 'while';
    test: ReactiveValue;
    loop: ReactiveBlock;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveForTerminal = {
    kind: 'for';
    init: ReactiveValue;
    test: ReactiveValue;
    update: ReactiveValue | null;
    loop: ReactiveBlock;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveForOfTerminal = {
    kind: 'for-of';
    init: ReactiveValue;
    test: ReactiveValue;
    loop: ReactiveBlock;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveForInTerminal = {
    kind: 'for-in';
    init: ReactiveValue;
    loop: ReactiveBlock;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveIfTerminal = {
    kind: 'if';
    test: Place;
    consequent: ReactiveBlock;
    alternate: ReactiveBlock | null;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveLabelTerminal = {
    kind: 'label';
    block: ReactiveBlock;
    id: InstructionId;
    loc: SourceLocation;
};
type ReactiveTryTerminal = {
    kind: 'try';
    block: ReactiveBlock;
    handlerBinding: Place | null;
    handler: ReactiveBlock;
    id: InstructionId;
    loc: SourceLocation;
};
type HIRFunction = {
    loc: SourceLocation;
    id: ValidIdentifierName | null;
    nameHint: string | null;
    fnType: ReactFunctionType;
    env: Environment;
    params: Array<Place | SpreadPattern>;
    returnTypeAnnotation: t.FlowType | t.TSType | null;
    returns: Place;
    context: Array<Place>;
    body: HIR;
    generator: boolean;
    async: boolean;
    directives: Array<string>;
    aliasingEffects: Array<AliasingEffect> | null;
};
type HIR = {
    entry: BlockId;
    blocks: Map<BlockId, BasicBlock>;
};
type BlockKind = 'block' | 'value' | 'loop' | 'sequence' | 'catch';
type BasicBlock = {
    kind: BlockKind;
    id: BlockId;
    instructions: Array<Instruction>;
    terminal: Terminal;
    preds: Set<BlockId>;
    phis: Set<Phi>;
};
type Terminal = UnsupportedTerminal | UnreachableTerminal | ThrowTerminal | ReturnTerminal | GotoTerminal | IfTerminal | BranchTerminal | SwitchTerminal | ForTerminal | ForOfTerminal | ForInTerminal | DoWhileTerminal | WhileTerminal | LogicalTerminal | TernaryTerminal | OptionalTerminal | LabelTerminal | SequenceTerminal | MaybeThrowTerminal | TryTerminal | ReactiveScopeTerminal | PrunedScopeTerminal;
type UnsupportedTerminal = {
    kind: 'unsupported';
    id: InstructionId;
    loc: SourceLocation;
    fallthrough?: never;
};
type UnreachableTerminal = {
    kind: 'unreachable';
    id: InstructionId;
    loc: SourceLocation;
    fallthrough?: never;
};
type ThrowTerminal = {
    kind: 'throw';
    value: Place;
    id: InstructionId;
    loc: SourceLocation;
    fallthrough?: never;
};
type Case = {
    test: Place | null;
    block: BlockId;
};
type ReturnVariant = 'Void' | 'Implicit' | 'Explicit';
type ReturnTerminal = {
    kind: 'return';
    returnVariant: ReturnVariant;
    loc: SourceLocation;
    value: Place;
    id: InstructionId;
    fallthrough?: never;
    effects: Array<AliasingEffect> | null;
};
type GotoTerminal = {
    kind: 'goto';
    block: BlockId;
    variant: GotoVariant;
    id: InstructionId;
    loc: SourceLocation;
    fallthrough?: never;
};
declare enum GotoVariant {
    Break = "Break",
    Continue = "Continue",
    Try = "Try"
}
type IfTerminal = {
    kind: 'if';
    test: Place;
    consequent: BlockId;
    alternate: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
    loc: SourceLocation;
};
type BranchTerminal = {
    kind: 'branch';
    test: Place;
    consequent: BlockId;
    alternate: BlockId;
    id: InstructionId;
    loc: SourceLocation;
    fallthrough: BlockId;
};
type SwitchTerminal = {
    kind: 'switch';
    test: Place;
    cases: Array<Case>;
    fallthrough: BlockId;
    id: InstructionId;
    loc: SourceLocation;
};
type DoWhileTerminal = {
    kind: 'do-while';
    loop: BlockId;
    test: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
    loc: SourceLocation;
};
type WhileTerminal = {
    kind: 'while';
    loc: SourceLocation;
    test: BlockId;
    loop: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
};
type ForTerminal = {
    kind: 'for';
    loc: SourceLocation;
    init: BlockId;
    test: BlockId;
    update: BlockId | null;
    loop: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
};
type ForOfTerminal = {
    kind: 'for-of';
    loc: SourceLocation;
    init: BlockId;
    test: BlockId;
    loop: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
};
type ForInTerminal = {
    kind: 'for-in';
    loc: SourceLocation;
    init: BlockId;
    loop: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
};
type LogicalTerminal = {
    kind: 'logical';
    operator: t.LogicalExpression['operator'];
    test: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
    loc: SourceLocation;
};
type TernaryTerminal = {
    kind: 'ternary';
    test: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
    loc: SourceLocation;
};
type LabelTerminal = {
    kind: 'label';
    block: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
    loc: SourceLocation;
};
type OptionalTerminal = {
    kind: 'optional';
    optional: boolean;
    test: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
    loc: SourceLocation;
};
type SequenceTerminal = {
    kind: 'sequence';
    block: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
    loc: SourceLocation;
};
type TryTerminal = {
    kind: 'try';
    block: BlockId;
    handlerBinding: Place | null;
    handler: BlockId;
    fallthrough: BlockId;
    id: InstructionId;
    loc: SourceLocation;
};
type MaybeThrowTerminal = {
    kind: 'maybe-throw';
    continuation: BlockId;
    handler: BlockId;
    id: InstructionId;
    loc: SourceLocation;
    fallthrough?: never;
    effects: Array<AliasingEffect> | null;
};
type ReactiveScopeTerminal = {
    kind: 'scope';
    fallthrough: BlockId;
    block: BlockId;
    scope: ReactiveScope;
    id: InstructionId;
    loc: SourceLocation;
};
type PrunedScopeTerminal = {
    kind: 'pruned-scope';
    fallthrough: BlockId;
    block: BlockId;
    scope: ReactiveScope;
    id: InstructionId;
    loc: SourceLocation;
};
type Instruction = {
    id: InstructionId;
    lvalue: Place;
    value: InstructionValue;
    loc: SourceLocation;
    effects: Array<AliasingEffect> | null;
};
type LValue = {
    place: Place;
    kind: InstructionKind;
};
type LValuePattern = {
    pattern: Pattern;
    kind: InstructionKind;
};
type ArrayExpression = {
    kind: 'ArrayExpression';
    elements: Array<Place | SpreadPattern | Hole>;
    loc: SourceLocation;
};
type Pattern = ArrayPattern | ObjectPattern;
type Hole = {
    kind: 'Hole';
};
type SpreadPattern = {
    kind: 'Spread';
    place: Place;
};
type ArrayPattern = {
    kind: 'ArrayPattern';
    items: Array<Place | SpreadPattern | Hole>;
};
type ObjectPattern = {
    kind: 'ObjectPattern';
    properties: Array<ObjectProperty | SpreadPattern>;
};
type ObjectPropertyKey = {
    kind: 'string';
    name: string;
} | {
    kind: 'identifier';
    name: string;
} | {
    kind: 'computed';
    name: Place;
} | {
    kind: 'number';
    name: number;
};
type ObjectProperty = {
    kind: 'ObjectProperty';
    key: ObjectPropertyKey;
    type: 'property' | 'method';
    place: Place;
};
type LoweredFunction = {
    func: HIRFunction;
};
type ObjectMethod = {
    kind: 'ObjectMethod';
    loc: SourceLocation;
    loweredFunc: LoweredFunction;
};
declare enum InstructionKind {
    Const = "Const",
    Let = "Let",
    Reassign = "Reassign",
    Catch = "Catch",
    HoistedConst = "HoistedConst",
    HoistedLet = "HoistedLet",
    HoistedFunction = "HoistedFunction",
    Function = "Function"
}
type Phi = {
    kind: 'Phi';
    place: Place;
    operands: Map<BlockId, Place>;
};
type ManualMemoDependency = {
    root: {
        kind: 'NamedLocal';
        value: Place;
    } | {
        kind: 'Global';
        identifierName: string;
    };
    path: DependencyPath;
};
type StartMemoize = {
    kind: 'StartMemoize';
    manualMemoId: number;
    deps: Array<ManualMemoDependency> | null;
    loc: SourceLocation;
};
type FinishMemoize = {
    kind: 'FinishMemoize';
    manualMemoId: number;
    decl: Place;
    pruned?: true;
    loc: SourceLocation;
};
type MethodCall = {
    kind: 'MethodCall';
    receiver: Place;
    property: Place;
    args: Array<Place | SpreadPattern>;
    loc: SourceLocation;
};
type CallExpression = {
    kind: 'CallExpression';
    callee: Place;
    args: Array<Place | SpreadPattern>;
    loc: SourceLocation;
    typeArguments?: Array<t.FlowType>;
};
type NewExpression = {
    kind: 'NewExpression';
    callee: Place;
    args: Array<Place | SpreadPattern>;
    loc: SourceLocation;
};
type LoadLocal = {
    kind: 'LoadLocal';
    place: Place;
    loc: SourceLocation;
};
type LoadContext = {
    kind: 'LoadContext';
    place: Place;
    loc: SourceLocation;
};
type InstructionValue = LoadLocal | LoadContext | {
    kind: 'DeclareLocal';
    lvalue: LValue;
    type: t.FlowType | t.TSType | null;
    loc: SourceLocation;
} | {
    kind: 'DeclareContext';
    lvalue: {
        kind: InstructionKind.Let | InstructionKind.HoistedConst | InstructionKind.HoistedLet | InstructionKind.HoistedFunction;
        place: Place;
    };
    loc: SourceLocation;
} | StoreLocal | {
    kind: 'StoreContext';
    lvalue: {
        kind: InstructionKind.Reassign | InstructionKind.Const | InstructionKind.Let | InstructionKind.Function;
        place: Place;
    };
    value: Place;
    loc: SourceLocation;
} | Destructure | {
    kind: 'Primitive';
    value: number | boolean | string | null | undefined;
    loc: SourceLocation;
} | JSXText | {
    kind: 'BinaryExpression';
    operator: Exclude<t.BinaryExpression['operator'], '|>'>;
    left: Place;
    right: Place;
    loc: SourceLocation;
} | NewExpression | CallExpression | MethodCall | {
    kind: 'UnaryExpression';
    operator: Exclude<t.UnaryExpression['operator'], 'throw' | 'delete'>;
    value: Place;
    loc: SourceLocation;
} | ({
    kind: 'TypeCastExpression';
    value: Place;
    type: Type;
    loc: SourceLocation;
} & ({
    typeAnnotation: t.FlowType;
    typeAnnotationKind: 'cast';
} | {
    typeAnnotation: t.TSType;
    typeAnnotationKind: 'as' | 'satisfies';
})) | JsxExpression | {
    kind: 'ObjectExpression';
    properties: Array<ObjectProperty | SpreadPattern>;
    loc: SourceLocation;
} | ObjectMethod | ArrayExpression | {
    kind: 'JsxFragment';
    children: Array<Place>;
    loc: SourceLocation;
} | {
    kind: 'RegExpLiteral';
    pattern: string;
    flags: string;
    loc: SourceLocation;
} | {
    kind: 'MetaProperty';
    meta: string;
    property: string;
    loc: SourceLocation;
} | {
    kind: 'PropertyStore';
    object: Place;
    property: PropertyLiteral;
    value: Place;
    loc: SourceLocation;
} | PropertyLoad | {
    kind: 'PropertyDelete';
    object: Place;
    property: PropertyLiteral;
    loc: SourceLocation;
} | {
    kind: 'ComputedStore';
    object: Place;
    property: Place;
    value: Place;
    loc: SourceLocation;
} | {
    kind: 'ComputedLoad';
    object: Place;
    property: Place;
    loc: SourceLocation;
} | {
    kind: 'ComputedDelete';
    object: Place;
    property: Place;
    loc: SourceLocation;
} | LoadGlobal | StoreGlobal | FunctionExpression | {
    kind: 'TaggedTemplateExpression';
    tag: Place;
    value: {
        raw: string;
        cooked?: string;
    };
    loc: SourceLocation;
} | {
    kind: 'TemplateLiteral';
    subexprs: Array<Place>;
    quasis: Array<{
        raw: string;
        cooked?: string;
    }>;
    loc: SourceLocation;
} | {
    kind: 'Await';
    value: Place;
    loc: SourceLocation;
} | {
    kind: 'GetIterator';
    collection: Place;
    loc: SourceLocation;
} | {
    kind: 'IteratorNext';
    iterator: Place;
    collection: Place;
    loc: SourceLocation;
} | {
    kind: 'NextPropertyOf';
    value: Place;
    loc: SourceLocation;
} | {
    kind: 'PrefixUpdate';
    lvalue: Place;
    operation: t.UpdateExpression['operator'];
    value: Place;
    loc: SourceLocation;
} | {
    kind: 'PostfixUpdate';
    lvalue: Place;
    operation: t.UpdateExpression['operator'];
    value: Place;
    loc: SourceLocation;
} | {
    kind: 'Debugger';
    loc: SourceLocation;
} | StartMemoize | FinishMemoize | {
    kind: 'UnsupportedNode';
    node: t.Node;
    loc: SourceLocation;
};
type JsxExpression = {
    kind: 'JsxExpression';
    tag: Place | BuiltinTag;
    props: Array<JsxAttribute>;
    children: Array<Place> | null;
    loc: SourceLocation;
    openingLoc: SourceLocation;
    closingLoc: SourceLocation;
};
type JsxAttribute = {
    kind: 'JsxSpreadAttribute';
    argument: Place;
} | {
    kind: 'JsxAttribute';
    name: string;
    place: Place;
};
type FunctionExpression = {
    kind: 'FunctionExpression';
    name: ValidIdentifierName | null;
    nameHint: string | null;
    loweredFunc: LoweredFunction;
    type: 'ArrowFunctionExpression' | 'FunctionExpression' | 'FunctionDeclaration';
    loc: SourceLocation;
};
type Destructure = {
    kind: 'Destructure';
    lvalue: LValuePattern;
    value: Place;
    loc: SourceLocation;
};
type Place = {
    kind: 'Identifier';
    identifier: Identifier;
    effect: Effect;
    reactive: boolean;
    loc: SourceLocation;
};
type JSXText = {
    kind: 'JSXText';
    value: string;
    loc: SourceLocation;
};
type StoreLocal = {
    kind: 'StoreLocal';
    lvalue: LValue;
    value: Place;
    type: t.FlowType | t.TSType | null;
    loc: SourceLocation;
};
type PropertyLoad = {
    kind: 'PropertyLoad';
    object: Place;
    property: PropertyLiteral;
    loc: SourceLocation;
};
type LoadGlobal = {
    kind: 'LoadGlobal';
    binding: NonLocalBinding;
    loc: SourceLocation;
};
type StoreGlobal = {
    kind: 'StoreGlobal';
    name: string;
    value: Place;
    loc: SourceLocation;
};
type BuiltinTag = {
    kind: 'BuiltinTag';
    name: string;
    loc: SourceLocation;
};
type MutableRange = {
    start: InstructionId;
    end: InstructionId;
};
type NonLocalImportSpecifier = {
    kind: 'ImportSpecifier';
    name: string;
    module: string;
    imported: string;
};
type NonLocalBinding = {
    kind: 'ImportDefault';
    name: string;
    module: string;
} | {
    kind: 'ImportNamespace';
    name: string;
    module: string;
} | NonLocalImportSpecifier | {
    kind: 'ModuleLocal';
    name: string;
} | {
    kind: 'Global';
    name: string;
};
type Identifier = {
    id: IdentifierId;
    declarationId: DeclarationId;
    name: IdentifierName | null;
    mutableRange: MutableRange;
    scope: ReactiveScope | null;
    type: Type;
    loc: SourceLocation;
};
type IdentifierName = ValidatedIdentifier | PromotedIdentifier;
type ValidatedIdentifier = {
    kind: 'named';
    value: ValidIdentifierName;
};
type PromotedIdentifier = {
    kind: 'promoted';
    value: string;
};
declare const opaqueValidIdentifierName: unique symbol;
type ValidIdentifierName = string & {
    [opaqueValidIdentifierName]: 'ValidIdentifierName';
};
declare enum ValueReason {
    Global = "global",
    JsxCaptured = "jsx-captured",
    HookCaptured = "hook-captured",
    HookReturn = "hook-return",
    Effect = "effect",
    KnownReturnSignature = "known-return-signature",
    Context = "context",
    State = "state",
    ReducerState = "reducer-state",
    ReactiveFunctionArgument = "reactive-function-argument",
    Other = "other"
}
declare enum ValueKind {
    MaybeFrozen = "maybefrozen",
    Frozen = "frozen",
    Primitive = "primitive",
    Global = "global",
    Mutable = "mutable",
    Context = "context"
}
declare enum Effect {
    Unknown = "<unknown>",
    Freeze = "freeze",
    Read = "read",
    Capture = "capture",
    ConditionallyMutateIterator = "mutate-iterator?",
    ConditionallyMutate = "mutate?",
    Mutate = "mutate",
    Store = "store"
}
type ReactiveScope = {
    id: ScopeId;
    range: MutableRange;
    dependencies: ReactiveScopeDependencies;
    declarations: Map<IdentifierId, ReactiveScopeDeclaration>;
    reassignments: Set<Identifier>;
    earlyReturnValue: {
        value: Identifier;
        loc: SourceLocation;
        label: BlockId;
    } | null;
    merged: Set<ScopeId>;
    loc: SourceLocation;
};
type ReactiveScopeDependencies = Set<ReactiveScopeDependency>;
type ReactiveScopeDeclaration = {
    identifier: Identifier;
    scope: ReactiveScope;
};
declare const opaquePropertyLiteral: unique symbol;
type PropertyLiteral = (string | number) & {
    [opaquePropertyLiteral]: 'PropertyLiteral';
};
type DependencyPathEntry = {
    property: PropertyLiteral;
    optional: boolean;
};
type DependencyPath = Array<DependencyPathEntry>;
type ReactiveScopeDependency = {
    identifier: Identifier;
    reactive: boolean;
    path: DependencyPath;
};
declare const opaqueBlockId: unique symbol;
type BlockId = number & {
    [opaqueBlockId]: 'BlockId';
};
declare const opaqueScopeId: unique symbol;
type ScopeId = number & {
    [opaqueScopeId]: 'ScopeId';
};
declare const opaqueIdentifierId: unique symbol;
type IdentifierId = number & {
    [opaqueIdentifierId]: 'IdentifierId';
};
declare const opageDeclarationId: unique symbol;
type DeclarationId = number & {
    [opageDeclarationId]: 'DeclarationId';
};
declare const opaqueInstructionId: unique symbol;
type InstructionId = number & {
    [opaqueInstructionId]: 'IdentifierId';
};

type Options = {
    indent: number;
};
declare function printFunctionWithOutlined(fn: HIRFunction): string;
declare function printHIR(ir: HIR, options?: Options | null): string;

declare enum ErrorSeverity {
    Error = "Error",
    Warning = "Warning",
    Hint = "Hint",
    Off = "Off"
}
type CompilerDiagnosticOptions = {
    category: ErrorCategory;
    reason: string;
    description: string | null;
    details: Array<CompilerDiagnosticDetail>;
    suggestions?: Array<CompilerSuggestion> | null | undefined;
};
type CompilerDiagnosticDetail = {
    kind: 'error';
    loc: SourceLocation | null;
    message: string | null;
} | {
    kind: 'hint';
    message: string;
};
declare enum CompilerSuggestionOperation {
    InsertBefore = 0,
    InsertAfter = 1,
    Remove = 2,
    Replace = 3
}
type CompilerSuggestion = {
    op: CompilerSuggestionOperation.InsertAfter | CompilerSuggestionOperation.InsertBefore | CompilerSuggestionOperation.Replace;
    range: [number, number];
    description: string;
    text: string;
} | {
    op: CompilerSuggestionOperation.Remove;
    range: [number, number];
    description: string;
};
type CompilerErrorDetailOptions = {
    category: ErrorCategory;
    reason: string;
    description?: string | null | undefined;
    loc: SourceLocation | null;
    suggestions?: Array<CompilerSuggestion> | null | undefined;
};
type PrintErrorMessageOptions = {
    eslint: boolean;
};
declare class CompilerDiagnostic {
    options: CompilerDiagnosticOptions;
    constructor(options: CompilerDiagnosticOptions);
    static create(options: Omit<CompilerDiagnosticOptions, 'details'>): CompilerDiagnostic;
    get reason(): CompilerDiagnosticOptions['reason'];
    get description(): CompilerDiagnosticOptions['description'];
    get severity(): ErrorSeverity;
    get suggestions(): CompilerDiagnosticOptions['suggestions'];
    get category(): ErrorCategory;
    withDetails(...details: Array<CompilerDiagnosticDetail>): CompilerDiagnostic;
    primaryLocation(): SourceLocation | null;
    printErrorMessage(source: string, options: PrintErrorMessageOptions): string;
    toString(): string;
}
declare class CompilerErrorDetail {
    options: CompilerErrorDetailOptions;
    constructor(options: CompilerErrorDetailOptions);
    get reason(): CompilerErrorDetailOptions['reason'];
    get description(): CompilerErrorDetailOptions['description'];
    get severity(): ErrorSeverity;
    get loc(): CompilerErrorDetailOptions['loc'];
    get suggestions(): CompilerErrorDetailOptions['suggestions'];
    get category(): ErrorCategory;
    primaryLocation(): SourceLocation | null;
    printErrorMessage(source: string, options: PrintErrorMessageOptions): string;
    toString(): string;
}
declare class CompilerError extends Error {
    details: Array<CompilerErrorDetail | CompilerDiagnostic>;
    disabledDetails: Array<CompilerErrorDetail | CompilerDiagnostic>;
    printedMessage: string | null;
    static invariant(condition: unknown, options: Omit<CompilerDiagnosticOptions, 'category'>): asserts condition;
    static throwDiagnostic(options: CompilerDiagnosticOptions): never;
    static throwTodo(options: Omit<CompilerErrorDetailOptions, 'category'>): never;
    static throwInvalidJS(options: Omit<CompilerErrorDetailOptions, 'category'>): never;
    static throwInvalidReact(options: CompilerErrorDetailOptions): never;
    static throwInvalidConfig(options: Omit<CompilerErrorDetailOptions, 'category'>): never;
    static throw(options: CompilerErrorDetailOptions): never;
    constructor(...args: Array<any>);
    get message(): string;
    set message(_message: string);
    toString(): string;
    withPrintedMessage(source: string, options: PrintErrorMessageOptions): CompilerError;
    printErrorMessage(source: string, options: PrintErrorMessageOptions): string;
    merge(other: CompilerError): void;
    pushDiagnostic(diagnostic: CompilerDiagnostic): void;
    push(options: CompilerErrorDetailOptions): CompilerErrorDetail;
    pushErrorDetail(detail: CompilerErrorDetail): CompilerErrorDetail;
    hasAnyErrors(): boolean;
    asResult(): Result<void, CompilerError>;
    hasErrors(): boolean;
    hasWarning(): boolean;
    hasHints(): boolean;
}
declare enum ErrorCategory {
    Hooks = "Hooks",
    CapitalizedCalls = "CapitalizedCalls",
    StaticComponents = "StaticComponents",
    UseMemo = "UseMemo",
    Factories = "Factories",
    PreserveManualMemo = "PreserveManualMemo",
    IncompatibleLibrary = "IncompatibleLibrary",
    Immutability = "Immutability",
    Globals = "Globals",
    Refs = "Refs",
    EffectDependencies = "EffectDependencies",
    EffectSetState = "EffectSetState",
    EffectDerivationsOfState = "EffectDerivationsOfState",
    ErrorBoundaries = "ErrorBoundaries",
    Purity = "Purity",
    RenderSetState = "RenderSetState",
    Invariant = "Invariant",
    Todo = "Todo",
    Syntax = "Syntax",
    UnsupportedSyntax = "UnsupportedSyntax",
    Config = "Config",
    Gating = "Gating",
    Suppression = "Suppression",
    AutomaticEffectDependencies = "AutomaticEffectDependencies",
    Fire = "Fire",
    FBT = "FBT"
}
type LintRule = {
    category: ErrorCategory;
    severity: ErrorSeverity;
    name: string;
    description: string;
    recommended: boolean;
};
declare const LintRules: Array<LintRule>;

type CodegenFunction = {
    type: 'CodegenFunction';
    id: t.Identifier | null;
    nameHint: string | null;
    params: t.FunctionDeclaration['params'];
    body: t.BlockStatement;
    generator: boolean;
    async: boolean;
    loc: SourceLocation;
    memoSlotsUsed: number;
    memoBlocks: number;
    memoValues: number;
    prunedMemoBlocks: number;
    prunedMemoValues: number;
    outlined: Array<{
        fn: CodegenFunction;
        type: ReactFunctionType | null;
    }>;
    hasInferredEffect: boolean;
    inferredEffectLocations: Set<SourceLocation>;
    hasFireRewrite: boolean;
};

declare function printReactiveFunctionWithOutlined(fn: ReactiveFunction): string;
declare function printReactiveFunction(fn: ReactiveFunction): string;

type CompilerPipelineValue = {
    kind: 'ast';
    name: string;
    value: CodegenFunction;
} | {
    kind: 'hir';
    name: string;
    value: HIRFunction;
} | {
    kind: 'reactive';
    name: string;
    value: ReactiveFunction;
} | {
    kind: 'debug';
    name: string;
    value: string;
};
declare function compileFn(func: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression | t.FunctionExpression>, config: EnvironmentConfig, fnType: ReactFunctionType, mode: CompilerMode, programContext: ProgramContext, logger: Logger | null, filename: string | null, code: string | null): CodegenFunction;

declare const PanicThresholdOptionsSchema: z.ZodEnum<{
    none: "none";
    all_errors: "all_errors";
    critical_errors: "critical_errors";
}>;
type PanicThresholdOptions = z.infer<typeof PanicThresholdOptionsSchema>;
declare const DynamicGatingOptionsSchema: z.ZodObject<{
    source: z.ZodString;
}, z.core.$strip>;
type DynamicGatingOptions = z.infer<typeof DynamicGatingOptionsSchema>;
declare const CustomOptOutDirectiveSchema: z.ZodDefault<z.ZodNullable<z.ZodArray<z.ZodString>>>;
type CustomOptOutDirective = z.infer<typeof CustomOptOutDirectiveSchema>;
type PluginOptions = Partial<{
    environment: Partial<EnvironmentConfig>;
    logger: Logger | null;
    gating: ExternalFunction | null;
    dynamicGating: DynamicGatingOptions | null;
    panicThreshold: PanicThresholdOptions;
    noEmit: boolean;
    compilationMode: CompilationMode;
    eslintSuppressionRules: Array<string> | null | undefined;
    flowSuppressions: boolean;
    ignoreUseNoForget: boolean;
    customOptOutDirectives: CustomOptOutDirective;
    sources: Array<string> | ((filename: string) => boolean) | null;
    enableReanimatedCheck: boolean;
    target: CompilerReactTarget;
}>;
type ParsedPluginOptions = Required<Omit<PluginOptions, 'environment'>> & {
    environment: EnvironmentConfig;
};
declare const CompilerReactTargetSchema: z.ZodUnion<readonly [z.ZodLiteral<"17">, z.ZodLiteral<"18">, z.ZodLiteral<"19">, z.ZodObject<{
    kind: z.ZodLiteral<"donotuse_meta_internal">;
    runtimeModule: z.ZodDefault<z.ZodString>;
}, z.core.$strip>]>;
type CompilerReactTarget = z.infer<typeof CompilerReactTargetSchema>;
declare const CompilationModeSchema: z.ZodEnum<{
    syntax: "syntax";
    infer: "infer";
    annotation: "annotation";
    all: "all";
}>;
type CompilationMode = z.infer<typeof CompilationModeSchema>;
type LoggerEvent = CompileSuccessEvent | CompileErrorEvent | CompileDiagnosticEvent | CompileSkipEvent | PipelineErrorEvent | TimingEvent | AutoDepsDecorationsEvent | AutoDepsEligibleEvent;
type CompileErrorEvent = {
    kind: 'CompileError';
    fnLoc: t.SourceLocation | null;
    detail: CompilerErrorDetail | CompilerDiagnostic;
};
type CompileDiagnosticEvent = {
    kind: 'CompileDiagnostic';
    fnLoc: t.SourceLocation | null;
    detail: Omit<Omit<CompilerErrorDetailOptions, 'severity'>, 'suggestions'>;
};
type CompileSuccessEvent = {
    kind: 'CompileSuccess';
    fnLoc: t.SourceLocation | null;
    fnName: string | null;
    memoSlots: number;
    memoBlocks: number;
    memoValues: number;
    prunedMemoBlocks: number;
    prunedMemoValues: number;
};
type CompileSkipEvent = {
    kind: 'CompileSkip';
    fnLoc: t.SourceLocation | null;
    reason: string;
    loc: t.SourceLocation | null;
};
type PipelineErrorEvent = {
    kind: 'PipelineError';
    fnLoc: t.SourceLocation | null;
    data: string;
};
type TimingEvent = {
    kind: 'Timing';
    measurement: PerformanceMeasure;
};
type AutoDepsDecorationsEvent = {
    kind: 'AutoDepsDecorations';
    fnLoc: t.SourceLocation;
    decorations: Array<t.SourceLocation>;
};
type AutoDepsEligibleEvent = {
    kind: 'AutoDepsEligible';
    fnLoc: t.SourceLocation;
    depArrayLoc: t.SourceLocation;
};
type Logger = {
    logEvent: (filename: string | null, event: LoggerEvent) => void;
    debugLogIRs?: (value: CompilerPipelineValue) => void;
};
declare function parsePluginOptions(obj: unknown): ParsedPluginOptions;

type CompilerPass = {
    opts: ParsedPluginOptions;
    filename: string | null;
    comments: Array<t.CommentBlock | t.CommentLine>;
    code: string | null;
};
declare const OPT_IN_DIRECTIVES: Set<string>;
declare const OPT_OUT_DIRECTIVES: Set<string>;
declare function tryFindDirectiveEnablingMemoization(directives: Array<t.Directive>, opts: ParsedPluginOptions): Result<t.Directive | null, CompilerError>;
declare function findDirectiveDisablingMemoization(directives: Array<t.Directive>, { customOptOutDirectives }: PluginOptions): t.Directive | null;
type BabelFn = NodePath$1<t.FunctionDeclaration> | NodePath$1<t.FunctionExpression> | NodePath$1<t.ArrowFunctionExpression>;
type CompileProgramMetadata = {
    retryErrors: Array<{
        fn: BabelFn;
        error: CompilerError;
    }>;
    inferredEffectLocations: Set<t.SourceLocation>;
};
declare function compileProgram(program: NodePath$1<t.Program>, pass: CompilerPass): CompileProgramMetadata | null;

type SuppressionRange = {
    disableComment: t.Comment;
    enableComment: t.Comment | null;
    source: SuppressionSource;
};
type SuppressionSource = 'Eslint' | 'Flow';

type ProgramContextOptions = {
    program: NodePath$1<t.Program>;
    suppressions: Array<SuppressionRange>;
    opts: ParsedPluginOptions;
    filename: string | null;
    code: string | null;
    hasModuleScopeOptOut: boolean;
};
declare class ProgramContext {
    scope: Scope;
    opts: ParsedPluginOptions;
    filename: string | null;
    code: string | null;
    reactRuntimeModule: string;
    suppressions: Array<SuppressionRange>;
    hasModuleScopeOptOut: boolean;
    alreadyCompiled: WeakSet<object> | Set<object>;
    knownReferencedNames: Set<string>;
    imports: Map<string, Map<string, NonLocalImportSpecifier>>;
    retryErrors: Array<{
        fn: BabelFn;
        error: CompilerError;
    }>;
    inferredEffectLocations: Set<t.SourceLocation>;
    constructor({ program, suppressions, opts, filename, code, hasModuleScopeOptOut, }: ProgramContextOptions);
    isHookName(name: string): boolean;
    hasReference(name: string): boolean;
    newUid(name: string): string;
    addMemoCacheImport(): NonLocalImportSpecifier;
    addImportSpecifier({ source: module, importSpecifierName: specifier }: ExternalFunction, nameHint?: string): NonLocalImportSpecifier;
    addNewReference(name: string): void;
    assertGlobalBinding(name: string, localScope?: Scope): Result<void, CompilerError>;
    logEvent(event: LoggerEvent): void;
}

declare function runBabelPluginReactCompiler(text: string, file: string, language: 'flow' | 'typescript', options: PluginOptions | null, includeAst?: boolean): BabelCore.BabelFileResult;

declare function parseConfigPragmaForTests(pragma: string, defaults: {
    compilationMode: CompilationMode;
    environment?: PartialEnvironmentConfig;
}): PluginOptions;

declare function BabelPluginReactCompiler(_babel: typeof BabelCore): BabelCore.PluginObj;

declare global {
}

export { CompilerDiagnostic, type CompilerDiagnosticDetail, type CompilerDiagnosticOptions, CompilerError, CompilerErrorDetail, type CompilerErrorDetailOptions, type CompilerPipelineValue, CompilerSuggestionOperation, Effect, type EnvironmentConfig, ErrorCategory, ErrorSeverity, type ExternalFunction, type Hook, type LintRule, LintRules, type Logger, type LoggerEvent, OPT_IN_DIRECTIVES, OPT_OUT_DIRECTIVES, type PluginOptions, ProgramContext, type SourceLocation, ValueKind, ValueReason, compileFn as compile, compileProgram, BabelPluginReactCompiler as default, findDirectiveDisablingMemoization, tryFindDirectiveEnablingMemoization as findDirectiveEnablingMemoization, parseConfigPragmaForTests, parsePluginOptions, printFunctionWithOutlined, printHIR, printReactiveFunction, printReactiveFunctionWithOutlined, runBabelPluginReactCompiler, validateEnvironmentConfig };
