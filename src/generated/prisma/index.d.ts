
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ToolUser
 * 
 */
export type ToolUser = $Result.DefaultSelection<Prisma.$ToolUserPayload>
/**
 * Model ToolSession
 * 
 */
export type ToolSession = $Result.DefaultSelection<Prisma.$ToolSessionPayload>
/**
 * Model LoginCode
 * 
 */
export type LoginCode = $Result.DefaultSelection<Prisma.$LoginCodePayload>
/**
 * Model Analysis
 * 
 */
export type Analysis = $Result.DefaultSelection<Prisma.$AnalysisPayload>
/**
 * Model Finding
 * 
 */
export type Finding = $Result.DefaultSelection<Prisma.$FindingPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more ToolUsers
 * const toolUsers = await prisma.toolUser.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more ToolUsers
   * const toolUsers = await prisma.toolUser.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.toolUser`: Exposes CRUD operations for the **ToolUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ToolUsers
    * const toolUsers = await prisma.toolUser.findMany()
    * ```
    */
  get toolUser(): Prisma.ToolUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.toolSession`: Exposes CRUD operations for the **ToolSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ToolSessions
    * const toolSessions = await prisma.toolSession.findMany()
    * ```
    */
  get toolSession(): Prisma.ToolSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loginCode`: Exposes CRUD operations for the **LoginCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoginCodes
    * const loginCodes = await prisma.loginCode.findMany()
    * ```
    */
  get loginCode(): Prisma.LoginCodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analysis`: Exposes CRUD operations for the **Analysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Analyses
    * const analyses = await prisma.analysis.findMany()
    * ```
    */
  get analysis(): Prisma.AnalysisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.finding`: Exposes CRUD operations for the **Finding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Findings
    * const findings = await prisma.finding.findMany()
    * ```
    */
  get finding(): Prisma.FindingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.5.0
   * Query Engine version: 280c870be64f457428992c43c1f6d557fab6e29e
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ToolUser: 'ToolUser',
    ToolSession: 'ToolSession',
    LoginCode: 'LoginCode',
    Analysis: 'Analysis',
    Finding: 'Finding'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "toolUser" | "toolSession" | "loginCode" | "analysis" | "finding"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ToolUser: {
        payload: Prisma.$ToolUserPayload<ExtArgs>
        fields: Prisma.ToolUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ToolUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ToolUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload>
          }
          findFirst: {
            args: Prisma.ToolUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ToolUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload>
          }
          findMany: {
            args: Prisma.ToolUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload>[]
          }
          create: {
            args: Prisma.ToolUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload>
          }
          createMany: {
            args: Prisma.ToolUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ToolUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload>[]
          }
          delete: {
            args: Prisma.ToolUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload>
          }
          update: {
            args: Prisma.ToolUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload>
          }
          deleteMany: {
            args: Prisma.ToolUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ToolUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ToolUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload>[]
          }
          upsert: {
            args: Prisma.ToolUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolUserPayload>
          }
          aggregate: {
            args: Prisma.ToolUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToolUser>
          }
          groupBy: {
            args: Prisma.ToolUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<ToolUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.ToolUserCountArgs<ExtArgs>
            result: $Utils.Optional<ToolUserCountAggregateOutputType> | number
          }
        }
      }
      ToolSession: {
        payload: Prisma.$ToolSessionPayload<ExtArgs>
        fields: Prisma.ToolSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ToolSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ToolSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload>
          }
          findFirst: {
            args: Prisma.ToolSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ToolSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload>
          }
          findMany: {
            args: Prisma.ToolSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload>[]
          }
          create: {
            args: Prisma.ToolSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload>
          }
          createMany: {
            args: Prisma.ToolSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ToolSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload>[]
          }
          delete: {
            args: Prisma.ToolSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload>
          }
          update: {
            args: Prisma.ToolSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload>
          }
          deleteMany: {
            args: Prisma.ToolSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ToolSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ToolSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload>[]
          }
          upsert: {
            args: Prisma.ToolSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ToolSessionPayload>
          }
          aggregate: {
            args: Prisma.ToolSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToolSession>
          }
          groupBy: {
            args: Prisma.ToolSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ToolSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ToolSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ToolSessionCountAggregateOutputType> | number
          }
        }
      }
      LoginCode: {
        payload: Prisma.$LoginCodePayload<ExtArgs>
        fields: Prisma.LoginCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoginCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoginCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          findFirst: {
            args: Prisma.LoginCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoginCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          findMany: {
            args: Prisma.LoginCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>[]
          }
          create: {
            args: Prisma.LoginCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          createMany: {
            args: Prisma.LoginCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoginCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>[]
          }
          delete: {
            args: Prisma.LoginCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          update: {
            args: Prisma.LoginCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          deleteMany: {
            args: Prisma.LoginCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoginCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoginCodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>[]
          }
          upsert: {
            args: Prisma.LoginCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          aggregate: {
            args: Prisma.LoginCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoginCode>
          }
          groupBy: {
            args: Prisma.LoginCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoginCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoginCodeCountArgs<ExtArgs>
            result: $Utils.Optional<LoginCodeCountAggregateOutputType> | number
          }
        }
      }
      Analysis: {
        payload: Prisma.$AnalysisPayload<ExtArgs>
        fields: Prisma.AnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          findFirst: {
            args: Prisma.AnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          findMany: {
            args: Prisma.AnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>[]
          }
          create: {
            args: Prisma.AnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          createMany: {
            args: Prisma.AnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>[]
          }
          delete: {
            args: Prisma.AnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          update: {
            args: Prisma.AnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          deleteMany: {
            args: Prisma.AnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalysisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>[]
          }
          upsert: {
            args: Prisma.AnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisPayload>
          }
          aggregate: {
            args: Prisma.AnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalysis>
          }
          groupBy: {
            args: Prisma.AnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysisCountAggregateOutputType> | number
          }
        }
      }
      Finding: {
        payload: Prisma.$FindingPayload<ExtArgs>
        fields: Prisma.FindingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FindingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FindingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          findFirst: {
            args: Prisma.FindingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FindingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          findMany: {
            args: Prisma.FindingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>[]
          }
          create: {
            args: Prisma.FindingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          createMany: {
            args: Prisma.FindingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FindingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>[]
          }
          delete: {
            args: Prisma.FindingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          update: {
            args: Prisma.FindingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          deleteMany: {
            args: Prisma.FindingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FindingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FindingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>[]
          }
          upsert: {
            args: Prisma.FindingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FindingPayload>
          }
          aggregate: {
            args: Prisma.FindingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFinding>
          }
          groupBy: {
            args: Prisma.FindingGroupByArgs<ExtArgs>
            result: $Utils.Optional<FindingGroupByOutputType>[]
          }
          count: {
            args: Prisma.FindingCountArgs<ExtArgs>
            result: $Utils.Optional<FindingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    toolUser?: ToolUserOmit
    toolSession?: ToolSessionOmit
    loginCode?: LoginCodeOmit
    analysis?: AnalysisOmit
    finding?: FindingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ToolUserCountOutputType
   */

  export type ToolUserCountOutputType = {
    sessions: number
    logins: number
    analyses: number
  }

  export type ToolUserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | ToolUserCountOutputTypeCountSessionsArgs
    logins?: boolean | ToolUserCountOutputTypeCountLoginsArgs
    analyses?: boolean | ToolUserCountOutputTypeCountAnalysesArgs
  }

  // Custom InputTypes
  /**
   * ToolUserCountOutputType without action
   */
  export type ToolUserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUserCountOutputType
     */
    select?: ToolUserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ToolUserCountOutputType without action
   */
  export type ToolUserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ToolSessionWhereInput
  }

  /**
   * ToolUserCountOutputType without action
   */
  export type ToolUserCountOutputTypeCountLoginsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginCodeWhereInput
  }

  /**
   * ToolUserCountOutputType without action
   */
  export type ToolUserCountOutputTypeCountAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisWhereInput
  }


  /**
   * Count Type AnalysisCountOutputType
   */

  export type AnalysisCountOutputType = {
    findings: number
  }

  export type AnalysisCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    findings?: boolean | AnalysisCountOutputTypeCountFindingsArgs
  }

  // Custom InputTypes
  /**
   * AnalysisCountOutputType without action
   */
  export type AnalysisCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisCountOutputType
     */
    select?: AnalysisCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AnalysisCountOutputType without action
   */
  export type AnalysisCountOutputTypeCountFindingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ToolUser
   */

  export type AggregateToolUser = {
    _count: ToolUserCountAggregateOutputType | null
    _min: ToolUserMinAggregateOutputType | null
    _max: ToolUserMaxAggregateOutputType | null
  }

  export type ToolUserMinAggregateOutputType = {
    id: string | null
    email: string | null
    approved: boolean | null
    isAdmin: boolean | null
    createdAt: Date | null
  }

  export type ToolUserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    approved: boolean | null
    isAdmin: boolean | null
    createdAt: Date | null
  }

  export type ToolUserCountAggregateOutputType = {
    id: number
    email: number
    approved: number
    isAdmin: number
    createdAt: number
    _all: number
  }


  export type ToolUserMinAggregateInputType = {
    id?: true
    email?: true
    approved?: true
    isAdmin?: true
    createdAt?: true
  }

  export type ToolUserMaxAggregateInputType = {
    id?: true
    email?: true
    approved?: true
    isAdmin?: true
    createdAt?: true
  }

  export type ToolUserCountAggregateInputType = {
    id?: true
    email?: true
    approved?: true
    isAdmin?: true
    createdAt?: true
    _all?: true
  }

  export type ToolUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ToolUser to aggregate.
     */
    where?: ToolUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolUsers to fetch.
     */
    orderBy?: ToolUserOrderByWithRelationInput | ToolUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ToolUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ToolUsers
    **/
    _count?: true | ToolUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ToolUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ToolUserMaxAggregateInputType
  }

  export type GetToolUserAggregateType<T extends ToolUserAggregateArgs> = {
        [P in keyof T & keyof AggregateToolUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToolUser[P]>
      : GetScalarType<T[P], AggregateToolUser[P]>
  }




  export type ToolUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ToolUserWhereInput
    orderBy?: ToolUserOrderByWithAggregationInput | ToolUserOrderByWithAggregationInput[]
    by: ToolUserScalarFieldEnum[] | ToolUserScalarFieldEnum
    having?: ToolUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ToolUserCountAggregateInputType | true
    _min?: ToolUserMinAggregateInputType
    _max?: ToolUserMaxAggregateInputType
  }

  export type ToolUserGroupByOutputType = {
    id: string
    email: string
    approved: boolean
    isAdmin: boolean
    createdAt: Date
    _count: ToolUserCountAggregateOutputType | null
    _min: ToolUserMinAggregateOutputType | null
    _max: ToolUserMaxAggregateOutputType | null
  }

  type GetToolUserGroupByPayload<T extends ToolUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ToolUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ToolUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ToolUserGroupByOutputType[P]>
            : GetScalarType<T[P], ToolUserGroupByOutputType[P]>
        }
      >
    >


  export type ToolUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    approved?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    sessions?: boolean | ToolUser$sessionsArgs<ExtArgs>
    logins?: boolean | ToolUser$loginsArgs<ExtArgs>
    analyses?: boolean | ToolUser$analysesArgs<ExtArgs>
    _count?: boolean | ToolUserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["toolUser"]>

  export type ToolUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    approved?: boolean
    isAdmin?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["toolUser"]>

  export type ToolUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    approved?: boolean
    isAdmin?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["toolUser"]>

  export type ToolUserSelectScalar = {
    id?: boolean
    email?: boolean
    approved?: boolean
    isAdmin?: boolean
    createdAt?: boolean
  }

  export type ToolUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "approved" | "isAdmin" | "createdAt", ExtArgs["result"]["toolUser"]>
  export type ToolUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | ToolUser$sessionsArgs<ExtArgs>
    logins?: boolean | ToolUser$loginsArgs<ExtArgs>
    analyses?: boolean | ToolUser$analysesArgs<ExtArgs>
    _count?: boolean | ToolUserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ToolUserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ToolUserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ToolUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ToolUser"
    objects: {
      sessions: Prisma.$ToolSessionPayload<ExtArgs>[]
      logins: Prisma.$LoginCodePayload<ExtArgs>[]
      analyses: Prisma.$AnalysisPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      approved: boolean
      isAdmin: boolean
      createdAt: Date
    }, ExtArgs["result"]["toolUser"]>
    composites: {}
  }

  type ToolUserGetPayload<S extends boolean | null | undefined | ToolUserDefaultArgs> = $Result.GetResult<Prisma.$ToolUserPayload, S>

  type ToolUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ToolUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ToolUserCountAggregateInputType | true
    }

  export interface ToolUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ToolUser'], meta: { name: 'ToolUser' } }
    /**
     * Find zero or one ToolUser that matches the filter.
     * @param {ToolUserFindUniqueArgs} args - Arguments to find a ToolUser
     * @example
     * // Get one ToolUser
     * const toolUser = await prisma.toolUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ToolUserFindUniqueArgs>(args: SelectSubset<T, ToolUserFindUniqueArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ToolUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ToolUserFindUniqueOrThrowArgs} args - Arguments to find a ToolUser
     * @example
     * // Get one ToolUser
     * const toolUser = await prisma.toolUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ToolUserFindUniqueOrThrowArgs>(args: SelectSubset<T, ToolUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ToolUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolUserFindFirstArgs} args - Arguments to find a ToolUser
     * @example
     * // Get one ToolUser
     * const toolUser = await prisma.toolUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ToolUserFindFirstArgs>(args?: SelectSubset<T, ToolUserFindFirstArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ToolUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolUserFindFirstOrThrowArgs} args - Arguments to find a ToolUser
     * @example
     * // Get one ToolUser
     * const toolUser = await prisma.toolUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ToolUserFindFirstOrThrowArgs>(args?: SelectSubset<T, ToolUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ToolUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ToolUsers
     * const toolUsers = await prisma.toolUser.findMany()
     * 
     * // Get first 10 ToolUsers
     * const toolUsers = await prisma.toolUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const toolUserWithIdOnly = await prisma.toolUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ToolUserFindManyArgs>(args?: SelectSubset<T, ToolUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ToolUser.
     * @param {ToolUserCreateArgs} args - Arguments to create a ToolUser.
     * @example
     * // Create one ToolUser
     * const ToolUser = await prisma.toolUser.create({
     *   data: {
     *     // ... data to create a ToolUser
     *   }
     * })
     * 
     */
    create<T extends ToolUserCreateArgs>(args: SelectSubset<T, ToolUserCreateArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ToolUsers.
     * @param {ToolUserCreateManyArgs} args - Arguments to create many ToolUsers.
     * @example
     * // Create many ToolUsers
     * const toolUser = await prisma.toolUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ToolUserCreateManyArgs>(args?: SelectSubset<T, ToolUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ToolUsers and returns the data saved in the database.
     * @param {ToolUserCreateManyAndReturnArgs} args - Arguments to create many ToolUsers.
     * @example
     * // Create many ToolUsers
     * const toolUser = await prisma.toolUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ToolUsers and only return the `id`
     * const toolUserWithIdOnly = await prisma.toolUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ToolUserCreateManyAndReturnArgs>(args?: SelectSubset<T, ToolUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ToolUser.
     * @param {ToolUserDeleteArgs} args - Arguments to delete one ToolUser.
     * @example
     * // Delete one ToolUser
     * const ToolUser = await prisma.toolUser.delete({
     *   where: {
     *     // ... filter to delete one ToolUser
     *   }
     * })
     * 
     */
    delete<T extends ToolUserDeleteArgs>(args: SelectSubset<T, ToolUserDeleteArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ToolUser.
     * @param {ToolUserUpdateArgs} args - Arguments to update one ToolUser.
     * @example
     * // Update one ToolUser
     * const toolUser = await prisma.toolUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ToolUserUpdateArgs>(args: SelectSubset<T, ToolUserUpdateArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ToolUsers.
     * @param {ToolUserDeleteManyArgs} args - Arguments to filter ToolUsers to delete.
     * @example
     * // Delete a few ToolUsers
     * const { count } = await prisma.toolUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ToolUserDeleteManyArgs>(args?: SelectSubset<T, ToolUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ToolUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ToolUsers
     * const toolUser = await prisma.toolUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ToolUserUpdateManyArgs>(args: SelectSubset<T, ToolUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ToolUsers and returns the data updated in the database.
     * @param {ToolUserUpdateManyAndReturnArgs} args - Arguments to update many ToolUsers.
     * @example
     * // Update many ToolUsers
     * const toolUser = await prisma.toolUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ToolUsers and only return the `id`
     * const toolUserWithIdOnly = await prisma.toolUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ToolUserUpdateManyAndReturnArgs>(args: SelectSubset<T, ToolUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ToolUser.
     * @param {ToolUserUpsertArgs} args - Arguments to update or create a ToolUser.
     * @example
     * // Update or create a ToolUser
     * const toolUser = await prisma.toolUser.upsert({
     *   create: {
     *     // ... data to create a ToolUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ToolUser we want to update
     *   }
     * })
     */
    upsert<T extends ToolUserUpsertArgs>(args: SelectSubset<T, ToolUserUpsertArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ToolUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolUserCountArgs} args - Arguments to filter ToolUsers to count.
     * @example
     * // Count the number of ToolUsers
     * const count = await prisma.toolUser.count({
     *   where: {
     *     // ... the filter for the ToolUsers we want to count
     *   }
     * })
    **/
    count<T extends ToolUserCountArgs>(
      args?: Subset<T, ToolUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ToolUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ToolUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ToolUserAggregateArgs>(args: Subset<T, ToolUserAggregateArgs>): Prisma.PrismaPromise<GetToolUserAggregateType<T>>

    /**
     * Group by ToolUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ToolUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ToolUserGroupByArgs['orderBy'] }
        : { orderBy?: ToolUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ToolUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetToolUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ToolUser model
   */
  readonly fields: ToolUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ToolUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ToolUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends ToolUser$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, ToolUser$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    logins<T extends ToolUser$loginsArgs<ExtArgs> = {}>(args?: Subset<T, ToolUser$loginsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    analyses<T extends ToolUser$analysesArgs<ExtArgs> = {}>(args?: Subset<T, ToolUser$analysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ToolUser model
   */
  interface ToolUserFieldRefs {
    readonly id: FieldRef<"ToolUser", 'String'>
    readonly email: FieldRef<"ToolUser", 'String'>
    readonly approved: FieldRef<"ToolUser", 'Boolean'>
    readonly isAdmin: FieldRef<"ToolUser", 'Boolean'>
    readonly createdAt: FieldRef<"ToolUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ToolUser findUnique
   */
  export type ToolUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    /**
     * Filter, which ToolUser to fetch.
     */
    where: ToolUserWhereUniqueInput
  }

  /**
   * ToolUser findUniqueOrThrow
   */
  export type ToolUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    /**
     * Filter, which ToolUser to fetch.
     */
    where: ToolUserWhereUniqueInput
  }

  /**
   * ToolUser findFirst
   */
  export type ToolUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    /**
     * Filter, which ToolUser to fetch.
     */
    where?: ToolUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolUsers to fetch.
     */
    orderBy?: ToolUserOrderByWithRelationInput | ToolUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ToolUsers.
     */
    cursor?: ToolUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ToolUsers.
     */
    distinct?: ToolUserScalarFieldEnum | ToolUserScalarFieldEnum[]
  }

  /**
   * ToolUser findFirstOrThrow
   */
  export type ToolUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    /**
     * Filter, which ToolUser to fetch.
     */
    where?: ToolUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolUsers to fetch.
     */
    orderBy?: ToolUserOrderByWithRelationInput | ToolUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ToolUsers.
     */
    cursor?: ToolUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ToolUsers.
     */
    distinct?: ToolUserScalarFieldEnum | ToolUserScalarFieldEnum[]
  }

  /**
   * ToolUser findMany
   */
  export type ToolUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    /**
     * Filter, which ToolUsers to fetch.
     */
    where?: ToolUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolUsers to fetch.
     */
    orderBy?: ToolUserOrderByWithRelationInput | ToolUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ToolUsers.
     */
    cursor?: ToolUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ToolUsers.
     */
    distinct?: ToolUserScalarFieldEnum | ToolUserScalarFieldEnum[]
  }

  /**
   * ToolUser create
   */
  export type ToolUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    /**
     * The data needed to create a ToolUser.
     */
    data: XOR<ToolUserCreateInput, ToolUserUncheckedCreateInput>
  }

  /**
   * ToolUser createMany
   */
  export type ToolUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ToolUsers.
     */
    data: ToolUserCreateManyInput | ToolUserCreateManyInput[]
  }

  /**
   * ToolUser createManyAndReturn
   */
  export type ToolUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * The data used to create many ToolUsers.
     */
    data: ToolUserCreateManyInput | ToolUserCreateManyInput[]
  }

  /**
   * ToolUser update
   */
  export type ToolUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    /**
     * The data needed to update a ToolUser.
     */
    data: XOR<ToolUserUpdateInput, ToolUserUncheckedUpdateInput>
    /**
     * Choose, which ToolUser to update.
     */
    where: ToolUserWhereUniqueInput
  }

  /**
   * ToolUser updateMany
   */
  export type ToolUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ToolUsers.
     */
    data: XOR<ToolUserUpdateManyMutationInput, ToolUserUncheckedUpdateManyInput>
    /**
     * Filter which ToolUsers to update
     */
    where?: ToolUserWhereInput
    /**
     * Limit how many ToolUsers to update.
     */
    limit?: number
  }

  /**
   * ToolUser updateManyAndReturn
   */
  export type ToolUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * The data used to update ToolUsers.
     */
    data: XOR<ToolUserUpdateManyMutationInput, ToolUserUncheckedUpdateManyInput>
    /**
     * Filter which ToolUsers to update
     */
    where?: ToolUserWhereInput
    /**
     * Limit how many ToolUsers to update.
     */
    limit?: number
  }

  /**
   * ToolUser upsert
   */
  export type ToolUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    /**
     * The filter to search for the ToolUser to update in case it exists.
     */
    where: ToolUserWhereUniqueInput
    /**
     * In case the ToolUser found by the `where` argument doesn't exist, create a new ToolUser with this data.
     */
    create: XOR<ToolUserCreateInput, ToolUserUncheckedCreateInput>
    /**
     * In case the ToolUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ToolUserUpdateInput, ToolUserUncheckedUpdateInput>
  }

  /**
   * ToolUser delete
   */
  export type ToolUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    /**
     * Filter which ToolUser to delete.
     */
    where: ToolUserWhereUniqueInput
  }

  /**
   * ToolUser deleteMany
   */
  export type ToolUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ToolUsers to delete
     */
    where?: ToolUserWhereInput
    /**
     * Limit how many ToolUsers to delete.
     */
    limit?: number
  }

  /**
   * ToolUser.sessions
   */
  export type ToolUser$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    where?: ToolSessionWhereInput
    orderBy?: ToolSessionOrderByWithRelationInput | ToolSessionOrderByWithRelationInput[]
    cursor?: ToolSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ToolSessionScalarFieldEnum | ToolSessionScalarFieldEnum[]
  }

  /**
   * ToolUser.logins
   */
  export type ToolUser$loginsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    where?: LoginCodeWhereInput
    orderBy?: LoginCodeOrderByWithRelationInput | LoginCodeOrderByWithRelationInput[]
    cursor?: LoginCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoginCodeScalarFieldEnum | LoginCodeScalarFieldEnum[]
  }

  /**
   * ToolUser.analyses
   */
  export type ToolUser$analysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    where?: AnalysisWhereInput
    orderBy?: AnalysisOrderByWithRelationInput | AnalysisOrderByWithRelationInput[]
    cursor?: AnalysisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysisScalarFieldEnum | AnalysisScalarFieldEnum[]
  }

  /**
   * ToolUser without action
   */
  export type ToolUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
  }


  /**
   * Model ToolSession
   */

  export type AggregateToolSession = {
    _count: ToolSessionCountAggregateOutputType | null
    _min: ToolSessionMinAggregateOutputType | null
    _max: ToolSessionMaxAggregateOutputType | null
  }

  export type ToolSessionMinAggregateOutputType = {
    id: string | null
    token: string | null
    expiresAt: Date | null
    userId: string | null
    createdAt: Date | null
  }

  export type ToolSessionMaxAggregateOutputType = {
    id: string | null
    token: string | null
    expiresAt: Date | null
    userId: string | null
    createdAt: Date | null
  }

  export type ToolSessionCountAggregateOutputType = {
    id: number
    token: number
    expiresAt: number
    userId: number
    createdAt: number
    _all: number
  }


  export type ToolSessionMinAggregateInputType = {
    id?: true
    token?: true
    expiresAt?: true
    userId?: true
    createdAt?: true
  }

  export type ToolSessionMaxAggregateInputType = {
    id?: true
    token?: true
    expiresAt?: true
    userId?: true
    createdAt?: true
  }

  export type ToolSessionCountAggregateInputType = {
    id?: true
    token?: true
    expiresAt?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type ToolSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ToolSession to aggregate.
     */
    where?: ToolSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolSessions to fetch.
     */
    orderBy?: ToolSessionOrderByWithRelationInput | ToolSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ToolSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ToolSessions
    **/
    _count?: true | ToolSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ToolSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ToolSessionMaxAggregateInputType
  }

  export type GetToolSessionAggregateType<T extends ToolSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateToolSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToolSession[P]>
      : GetScalarType<T[P], AggregateToolSession[P]>
  }




  export type ToolSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ToolSessionWhereInput
    orderBy?: ToolSessionOrderByWithAggregationInput | ToolSessionOrderByWithAggregationInput[]
    by: ToolSessionScalarFieldEnum[] | ToolSessionScalarFieldEnum
    having?: ToolSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ToolSessionCountAggregateInputType | true
    _min?: ToolSessionMinAggregateInputType
    _max?: ToolSessionMaxAggregateInputType
  }

  export type ToolSessionGroupByOutputType = {
    id: string
    token: string
    expiresAt: Date
    userId: string
    createdAt: Date
    _count: ToolSessionCountAggregateOutputType | null
    _min: ToolSessionMinAggregateOutputType | null
    _max: ToolSessionMaxAggregateOutputType | null
  }

  type GetToolSessionGroupByPayload<T extends ToolSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ToolSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ToolSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ToolSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ToolSessionGroupByOutputType[P]>
        }
      >
    >


  export type ToolSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    expiresAt?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["toolSession"]>

  export type ToolSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    expiresAt?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["toolSession"]>

  export type ToolSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    expiresAt?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["toolSession"]>

  export type ToolSessionSelectScalar = {
    id?: boolean
    token?: boolean
    expiresAt?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type ToolSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "expiresAt" | "userId" | "createdAt", ExtArgs["result"]["toolSession"]>
  export type ToolSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }
  export type ToolSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }
  export type ToolSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }

  export type $ToolSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ToolSession"
    objects: {
      user: Prisma.$ToolUserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      expiresAt: Date
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["toolSession"]>
    composites: {}
  }

  type ToolSessionGetPayload<S extends boolean | null | undefined | ToolSessionDefaultArgs> = $Result.GetResult<Prisma.$ToolSessionPayload, S>

  type ToolSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ToolSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ToolSessionCountAggregateInputType | true
    }

  export interface ToolSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ToolSession'], meta: { name: 'ToolSession' } }
    /**
     * Find zero or one ToolSession that matches the filter.
     * @param {ToolSessionFindUniqueArgs} args - Arguments to find a ToolSession
     * @example
     * // Get one ToolSession
     * const toolSession = await prisma.toolSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ToolSessionFindUniqueArgs>(args: SelectSubset<T, ToolSessionFindUniqueArgs<ExtArgs>>): Prisma__ToolSessionClient<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ToolSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ToolSessionFindUniqueOrThrowArgs} args - Arguments to find a ToolSession
     * @example
     * // Get one ToolSession
     * const toolSession = await prisma.toolSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ToolSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ToolSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ToolSessionClient<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ToolSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolSessionFindFirstArgs} args - Arguments to find a ToolSession
     * @example
     * // Get one ToolSession
     * const toolSession = await prisma.toolSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ToolSessionFindFirstArgs>(args?: SelectSubset<T, ToolSessionFindFirstArgs<ExtArgs>>): Prisma__ToolSessionClient<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ToolSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolSessionFindFirstOrThrowArgs} args - Arguments to find a ToolSession
     * @example
     * // Get one ToolSession
     * const toolSession = await prisma.toolSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ToolSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ToolSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ToolSessionClient<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ToolSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ToolSessions
     * const toolSessions = await prisma.toolSession.findMany()
     * 
     * // Get first 10 ToolSessions
     * const toolSessions = await prisma.toolSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const toolSessionWithIdOnly = await prisma.toolSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ToolSessionFindManyArgs>(args?: SelectSubset<T, ToolSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ToolSession.
     * @param {ToolSessionCreateArgs} args - Arguments to create a ToolSession.
     * @example
     * // Create one ToolSession
     * const ToolSession = await prisma.toolSession.create({
     *   data: {
     *     // ... data to create a ToolSession
     *   }
     * })
     * 
     */
    create<T extends ToolSessionCreateArgs>(args: SelectSubset<T, ToolSessionCreateArgs<ExtArgs>>): Prisma__ToolSessionClient<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ToolSessions.
     * @param {ToolSessionCreateManyArgs} args - Arguments to create many ToolSessions.
     * @example
     * // Create many ToolSessions
     * const toolSession = await prisma.toolSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ToolSessionCreateManyArgs>(args?: SelectSubset<T, ToolSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ToolSessions and returns the data saved in the database.
     * @param {ToolSessionCreateManyAndReturnArgs} args - Arguments to create many ToolSessions.
     * @example
     * // Create many ToolSessions
     * const toolSession = await prisma.toolSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ToolSessions and only return the `id`
     * const toolSessionWithIdOnly = await prisma.toolSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ToolSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ToolSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ToolSession.
     * @param {ToolSessionDeleteArgs} args - Arguments to delete one ToolSession.
     * @example
     * // Delete one ToolSession
     * const ToolSession = await prisma.toolSession.delete({
     *   where: {
     *     // ... filter to delete one ToolSession
     *   }
     * })
     * 
     */
    delete<T extends ToolSessionDeleteArgs>(args: SelectSubset<T, ToolSessionDeleteArgs<ExtArgs>>): Prisma__ToolSessionClient<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ToolSession.
     * @param {ToolSessionUpdateArgs} args - Arguments to update one ToolSession.
     * @example
     * // Update one ToolSession
     * const toolSession = await prisma.toolSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ToolSessionUpdateArgs>(args: SelectSubset<T, ToolSessionUpdateArgs<ExtArgs>>): Prisma__ToolSessionClient<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ToolSessions.
     * @param {ToolSessionDeleteManyArgs} args - Arguments to filter ToolSessions to delete.
     * @example
     * // Delete a few ToolSessions
     * const { count } = await prisma.toolSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ToolSessionDeleteManyArgs>(args?: SelectSubset<T, ToolSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ToolSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ToolSessions
     * const toolSession = await prisma.toolSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ToolSessionUpdateManyArgs>(args: SelectSubset<T, ToolSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ToolSessions and returns the data updated in the database.
     * @param {ToolSessionUpdateManyAndReturnArgs} args - Arguments to update many ToolSessions.
     * @example
     * // Update many ToolSessions
     * const toolSession = await prisma.toolSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ToolSessions and only return the `id`
     * const toolSessionWithIdOnly = await prisma.toolSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ToolSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ToolSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ToolSession.
     * @param {ToolSessionUpsertArgs} args - Arguments to update or create a ToolSession.
     * @example
     * // Update or create a ToolSession
     * const toolSession = await prisma.toolSession.upsert({
     *   create: {
     *     // ... data to create a ToolSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ToolSession we want to update
     *   }
     * })
     */
    upsert<T extends ToolSessionUpsertArgs>(args: SelectSubset<T, ToolSessionUpsertArgs<ExtArgs>>): Prisma__ToolSessionClient<$Result.GetResult<Prisma.$ToolSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ToolSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolSessionCountArgs} args - Arguments to filter ToolSessions to count.
     * @example
     * // Count the number of ToolSessions
     * const count = await prisma.toolSession.count({
     *   where: {
     *     // ... the filter for the ToolSessions we want to count
     *   }
     * })
    **/
    count<T extends ToolSessionCountArgs>(
      args?: Subset<T, ToolSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ToolSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ToolSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ToolSessionAggregateArgs>(args: Subset<T, ToolSessionAggregateArgs>): Prisma.PrismaPromise<GetToolSessionAggregateType<T>>

    /**
     * Group by ToolSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ToolSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ToolSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ToolSessionGroupByArgs['orderBy'] }
        : { orderBy?: ToolSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ToolSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetToolSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ToolSession model
   */
  readonly fields: ToolSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ToolSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ToolSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends ToolUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ToolUserDefaultArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ToolSession model
   */
  interface ToolSessionFieldRefs {
    readonly id: FieldRef<"ToolSession", 'String'>
    readonly token: FieldRef<"ToolSession", 'String'>
    readonly expiresAt: FieldRef<"ToolSession", 'DateTime'>
    readonly userId: FieldRef<"ToolSession", 'String'>
    readonly createdAt: FieldRef<"ToolSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ToolSession findUnique
   */
  export type ToolSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    /**
     * Filter, which ToolSession to fetch.
     */
    where: ToolSessionWhereUniqueInput
  }

  /**
   * ToolSession findUniqueOrThrow
   */
  export type ToolSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    /**
     * Filter, which ToolSession to fetch.
     */
    where: ToolSessionWhereUniqueInput
  }

  /**
   * ToolSession findFirst
   */
  export type ToolSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    /**
     * Filter, which ToolSession to fetch.
     */
    where?: ToolSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolSessions to fetch.
     */
    orderBy?: ToolSessionOrderByWithRelationInput | ToolSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ToolSessions.
     */
    cursor?: ToolSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ToolSessions.
     */
    distinct?: ToolSessionScalarFieldEnum | ToolSessionScalarFieldEnum[]
  }

  /**
   * ToolSession findFirstOrThrow
   */
  export type ToolSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    /**
     * Filter, which ToolSession to fetch.
     */
    where?: ToolSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolSessions to fetch.
     */
    orderBy?: ToolSessionOrderByWithRelationInput | ToolSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ToolSessions.
     */
    cursor?: ToolSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ToolSessions.
     */
    distinct?: ToolSessionScalarFieldEnum | ToolSessionScalarFieldEnum[]
  }

  /**
   * ToolSession findMany
   */
  export type ToolSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    /**
     * Filter, which ToolSessions to fetch.
     */
    where?: ToolSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ToolSessions to fetch.
     */
    orderBy?: ToolSessionOrderByWithRelationInput | ToolSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ToolSessions.
     */
    cursor?: ToolSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ToolSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ToolSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ToolSessions.
     */
    distinct?: ToolSessionScalarFieldEnum | ToolSessionScalarFieldEnum[]
  }

  /**
   * ToolSession create
   */
  export type ToolSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ToolSession.
     */
    data: XOR<ToolSessionCreateInput, ToolSessionUncheckedCreateInput>
  }

  /**
   * ToolSession createMany
   */
  export type ToolSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ToolSessions.
     */
    data: ToolSessionCreateManyInput | ToolSessionCreateManyInput[]
  }

  /**
   * ToolSession createManyAndReturn
   */
  export type ToolSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ToolSessions.
     */
    data: ToolSessionCreateManyInput | ToolSessionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ToolSession update
   */
  export type ToolSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ToolSession.
     */
    data: XOR<ToolSessionUpdateInput, ToolSessionUncheckedUpdateInput>
    /**
     * Choose, which ToolSession to update.
     */
    where: ToolSessionWhereUniqueInput
  }

  /**
   * ToolSession updateMany
   */
  export type ToolSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ToolSessions.
     */
    data: XOR<ToolSessionUpdateManyMutationInput, ToolSessionUncheckedUpdateManyInput>
    /**
     * Filter which ToolSessions to update
     */
    where?: ToolSessionWhereInput
    /**
     * Limit how many ToolSessions to update.
     */
    limit?: number
  }

  /**
   * ToolSession updateManyAndReturn
   */
  export type ToolSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * The data used to update ToolSessions.
     */
    data: XOR<ToolSessionUpdateManyMutationInput, ToolSessionUncheckedUpdateManyInput>
    /**
     * Filter which ToolSessions to update
     */
    where?: ToolSessionWhereInput
    /**
     * Limit how many ToolSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ToolSession upsert
   */
  export type ToolSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ToolSession to update in case it exists.
     */
    where: ToolSessionWhereUniqueInput
    /**
     * In case the ToolSession found by the `where` argument doesn't exist, create a new ToolSession with this data.
     */
    create: XOR<ToolSessionCreateInput, ToolSessionUncheckedCreateInput>
    /**
     * In case the ToolSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ToolSessionUpdateInput, ToolSessionUncheckedUpdateInput>
  }

  /**
   * ToolSession delete
   */
  export type ToolSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
    /**
     * Filter which ToolSession to delete.
     */
    where: ToolSessionWhereUniqueInput
  }

  /**
   * ToolSession deleteMany
   */
  export type ToolSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ToolSessions to delete
     */
    where?: ToolSessionWhereInput
    /**
     * Limit how many ToolSessions to delete.
     */
    limit?: number
  }

  /**
   * ToolSession without action
   */
  export type ToolSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolSession
     */
    select?: ToolSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolSession
     */
    omit?: ToolSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolSessionInclude<ExtArgs> | null
  }


  /**
   * Model LoginCode
   */

  export type AggregateLoginCode = {
    _count: LoginCodeCountAggregateOutputType | null
    _min: LoginCodeMinAggregateOutputType | null
    _max: LoginCodeMaxAggregateOutputType | null
  }

  export type LoginCodeMinAggregateOutputType = {
    id: string | null
    email: string | null
    code: string | null
    expiresAt: Date | null
    usedAt: Date | null
    userId: string | null
    createdAt: Date | null
  }

  export type LoginCodeMaxAggregateOutputType = {
    id: string | null
    email: string | null
    code: string | null
    expiresAt: Date | null
    usedAt: Date | null
    userId: string | null
    createdAt: Date | null
  }

  export type LoginCodeCountAggregateOutputType = {
    id: number
    email: number
    code: number
    expiresAt: number
    usedAt: number
    userId: number
    createdAt: number
    _all: number
  }


  export type LoginCodeMinAggregateInputType = {
    id?: true
    email?: true
    code?: true
    expiresAt?: true
    usedAt?: true
    userId?: true
    createdAt?: true
  }

  export type LoginCodeMaxAggregateInputType = {
    id?: true
    email?: true
    code?: true
    expiresAt?: true
    usedAt?: true
    userId?: true
    createdAt?: true
  }

  export type LoginCodeCountAggregateInputType = {
    id?: true
    email?: true
    code?: true
    expiresAt?: true
    usedAt?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type LoginCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginCode to aggregate.
     */
    where?: LoginCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginCodes to fetch.
     */
    orderBy?: LoginCodeOrderByWithRelationInput | LoginCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoginCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoginCodes
    **/
    _count?: true | LoginCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoginCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoginCodeMaxAggregateInputType
  }

  export type GetLoginCodeAggregateType<T extends LoginCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateLoginCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoginCode[P]>
      : GetScalarType<T[P], AggregateLoginCode[P]>
  }




  export type LoginCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginCodeWhereInput
    orderBy?: LoginCodeOrderByWithAggregationInput | LoginCodeOrderByWithAggregationInput[]
    by: LoginCodeScalarFieldEnum[] | LoginCodeScalarFieldEnum
    having?: LoginCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoginCodeCountAggregateInputType | true
    _min?: LoginCodeMinAggregateInputType
    _max?: LoginCodeMaxAggregateInputType
  }

  export type LoginCodeGroupByOutputType = {
    id: string
    email: string
    code: string
    expiresAt: Date
    usedAt: Date | null
    userId: string | null
    createdAt: Date
    _count: LoginCodeCountAggregateOutputType | null
    _min: LoginCodeMinAggregateOutputType | null
    _max: LoginCodeMaxAggregateOutputType | null
  }

  type GetLoginCodeGroupByPayload<T extends LoginCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoginCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoginCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoginCodeGroupByOutputType[P]>
            : GetScalarType<T[P], LoginCodeGroupByOutputType[P]>
        }
      >
    >


  export type LoginCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    code?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | LoginCode$userArgs<ExtArgs>
  }, ExtArgs["result"]["loginCode"]>

  export type LoginCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    code?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | LoginCode$userArgs<ExtArgs>
  }, ExtArgs["result"]["loginCode"]>

  export type LoginCodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    code?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | LoginCode$userArgs<ExtArgs>
  }, ExtArgs["result"]["loginCode"]>

  export type LoginCodeSelectScalar = {
    id?: boolean
    email?: boolean
    code?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type LoginCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "code" | "expiresAt" | "usedAt" | "userId" | "createdAt", ExtArgs["result"]["loginCode"]>
  export type LoginCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | LoginCode$userArgs<ExtArgs>
  }
  export type LoginCodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | LoginCode$userArgs<ExtArgs>
  }
  export type LoginCodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | LoginCode$userArgs<ExtArgs>
  }

  export type $LoginCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoginCode"
    objects: {
      user: Prisma.$ToolUserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      code: string
      expiresAt: Date
      usedAt: Date | null
      userId: string | null
      createdAt: Date
    }, ExtArgs["result"]["loginCode"]>
    composites: {}
  }

  type LoginCodeGetPayload<S extends boolean | null | undefined | LoginCodeDefaultArgs> = $Result.GetResult<Prisma.$LoginCodePayload, S>

  type LoginCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoginCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoginCodeCountAggregateInputType | true
    }

  export interface LoginCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoginCode'], meta: { name: 'LoginCode' } }
    /**
     * Find zero or one LoginCode that matches the filter.
     * @param {LoginCodeFindUniqueArgs} args - Arguments to find a LoginCode
     * @example
     * // Get one LoginCode
     * const loginCode = await prisma.loginCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoginCodeFindUniqueArgs>(args: SelectSubset<T, LoginCodeFindUniqueArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoginCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoginCodeFindUniqueOrThrowArgs} args - Arguments to find a LoginCode
     * @example
     * // Get one LoginCode
     * const loginCode = await prisma.loginCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoginCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, LoginCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeFindFirstArgs} args - Arguments to find a LoginCode
     * @example
     * // Get one LoginCode
     * const loginCode = await prisma.loginCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoginCodeFindFirstArgs>(args?: SelectSubset<T, LoginCodeFindFirstArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeFindFirstOrThrowArgs} args - Arguments to find a LoginCode
     * @example
     * // Get one LoginCode
     * const loginCode = await prisma.loginCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoginCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, LoginCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoginCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoginCodes
     * const loginCodes = await prisma.loginCode.findMany()
     * 
     * // Get first 10 LoginCodes
     * const loginCodes = await prisma.loginCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loginCodeWithIdOnly = await prisma.loginCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoginCodeFindManyArgs>(args?: SelectSubset<T, LoginCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoginCode.
     * @param {LoginCodeCreateArgs} args - Arguments to create a LoginCode.
     * @example
     * // Create one LoginCode
     * const LoginCode = await prisma.loginCode.create({
     *   data: {
     *     // ... data to create a LoginCode
     *   }
     * })
     * 
     */
    create<T extends LoginCodeCreateArgs>(args: SelectSubset<T, LoginCodeCreateArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoginCodes.
     * @param {LoginCodeCreateManyArgs} args - Arguments to create many LoginCodes.
     * @example
     * // Create many LoginCodes
     * const loginCode = await prisma.loginCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoginCodeCreateManyArgs>(args?: SelectSubset<T, LoginCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoginCodes and returns the data saved in the database.
     * @param {LoginCodeCreateManyAndReturnArgs} args - Arguments to create many LoginCodes.
     * @example
     * // Create many LoginCodes
     * const loginCode = await prisma.loginCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LoginCodes and only return the `id`
     * const loginCodeWithIdOnly = await prisma.loginCode.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoginCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, LoginCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LoginCode.
     * @param {LoginCodeDeleteArgs} args - Arguments to delete one LoginCode.
     * @example
     * // Delete one LoginCode
     * const LoginCode = await prisma.loginCode.delete({
     *   where: {
     *     // ... filter to delete one LoginCode
     *   }
     * })
     * 
     */
    delete<T extends LoginCodeDeleteArgs>(args: SelectSubset<T, LoginCodeDeleteArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoginCode.
     * @param {LoginCodeUpdateArgs} args - Arguments to update one LoginCode.
     * @example
     * // Update one LoginCode
     * const loginCode = await prisma.loginCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoginCodeUpdateArgs>(args: SelectSubset<T, LoginCodeUpdateArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoginCodes.
     * @param {LoginCodeDeleteManyArgs} args - Arguments to filter LoginCodes to delete.
     * @example
     * // Delete a few LoginCodes
     * const { count } = await prisma.loginCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoginCodeDeleteManyArgs>(args?: SelectSubset<T, LoginCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoginCodes
     * const loginCode = await prisma.loginCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoginCodeUpdateManyArgs>(args: SelectSubset<T, LoginCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginCodes and returns the data updated in the database.
     * @param {LoginCodeUpdateManyAndReturnArgs} args - Arguments to update many LoginCodes.
     * @example
     * // Update many LoginCodes
     * const loginCode = await prisma.loginCode.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LoginCodes and only return the `id`
     * const loginCodeWithIdOnly = await prisma.loginCode.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoginCodeUpdateManyAndReturnArgs>(args: SelectSubset<T, LoginCodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LoginCode.
     * @param {LoginCodeUpsertArgs} args - Arguments to update or create a LoginCode.
     * @example
     * // Update or create a LoginCode
     * const loginCode = await prisma.loginCode.upsert({
     *   create: {
     *     // ... data to create a LoginCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoginCode we want to update
     *   }
     * })
     */
    upsert<T extends LoginCodeUpsertArgs>(args: SelectSubset<T, LoginCodeUpsertArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoginCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeCountArgs} args - Arguments to filter LoginCodes to count.
     * @example
     * // Count the number of LoginCodes
     * const count = await prisma.loginCode.count({
     *   where: {
     *     // ... the filter for the LoginCodes we want to count
     *   }
     * })
    **/
    count<T extends LoginCodeCountArgs>(
      args?: Subset<T, LoginCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoginCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoginCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoginCodeAggregateArgs>(args: Subset<T, LoginCodeAggregateArgs>): Prisma.PrismaPromise<GetLoginCodeAggregateType<T>>

    /**
     * Group by LoginCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoginCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoginCodeGroupByArgs['orderBy'] }
        : { orderBy?: LoginCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoginCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoginCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoginCode model
   */
  readonly fields: LoginCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoginCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoginCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends LoginCode$userArgs<ExtArgs> = {}>(args?: Subset<T, LoginCode$userArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoginCode model
   */
  interface LoginCodeFieldRefs {
    readonly id: FieldRef<"LoginCode", 'String'>
    readonly email: FieldRef<"LoginCode", 'String'>
    readonly code: FieldRef<"LoginCode", 'String'>
    readonly expiresAt: FieldRef<"LoginCode", 'DateTime'>
    readonly usedAt: FieldRef<"LoginCode", 'DateTime'>
    readonly userId: FieldRef<"LoginCode", 'String'>
    readonly createdAt: FieldRef<"LoginCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoginCode findUnique
   */
  export type LoginCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    /**
     * Filter, which LoginCode to fetch.
     */
    where: LoginCodeWhereUniqueInput
  }

  /**
   * LoginCode findUniqueOrThrow
   */
  export type LoginCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    /**
     * Filter, which LoginCode to fetch.
     */
    where: LoginCodeWhereUniqueInput
  }

  /**
   * LoginCode findFirst
   */
  export type LoginCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    /**
     * Filter, which LoginCode to fetch.
     */
    where?: LoginCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginCodes to fetch.
     */
    orderBy?: LoginCodeOrderByWithRelationInput | LoginCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginCodes.
     */
    cursor?: LoginCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginCodes.
     */
    distinct?: LoginCodeScalarFieldEnum | LoginCodeScalarFieldEnum[]
  }

  /**
   * LoginCode findFirstOrThrow
   */
  export type LoginCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    /**
     * Filter, which LoginCode to fetch.
     */
    where?: LoginCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginCodes to fetch.
     */
    orderBy?: LoginCodeOrderByWithRelationInput | LoginCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginCodes.
     */
    cursor?: LoginCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginCodes.
     */
    distinct?: LoginCodeScalarFieldEnum | LoginCodeScalarFieldEnum[]
  }

  /**
   * LoginCode findMany
   */
  export type LoginCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    /**
     * Filter, which LoginCodes to fetch.
     */
    where?: LoginCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginCodes to fetch.
     */
    orderBy?: LoginCodeOrderByWithRelationInput | LoginCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoginCodes.
     */
    cursor?: LoginCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginCodes.
     */
    distinct?: LoginCodeScalarFieldEnum | LoginCodeScalarFieldEnum[]
  }

  /**
   * LoginCode create
   */
  export type LoginCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a LoginCode.
     */
    data: XOR<LoginCodeCreateInput, LoginCodeUncheckedCreateInput>
  }

  /**
   * LoginCode createMany
   */
  export type LoginCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoginCodes.
     */
    data: LoginCodeCreateManyInput | LoginCodeCreateManyInput[]
  }

  /**
   * LoginCode createManyAndReturn
   */
  export type LoginCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * The data used to create many LoginCodes.
     */
    data: LoginCodeCreateManyInput | LoginCodeCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginCode update
   */
  export type LoginCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a LoginCode.
     */
    data: XOR<LoginCodeUpdateInput, LoginCodeUncheckedUpdateInput>
    /**
     * Choose, which LoginCode to update.
     */
    where: LoginCodeWhereUniqueInput
  }

  /**
   * LoginCode updateMany
   */
  export type LoginCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoginCodes.
     */
    data: XOR<LoginCodeUpdateManyMutationInput, LoginCodeUncheckedUpdateManyInput>
    /**
     * Filter which LoginCodes to update
     */
    where?: LoginCodeWhereInput
    /**
     * Limit how many LoginCodes to update.
     */
    limit?: number
  }

  /**
   * LoginCode updateManyAndReturn
   */
  export type LoginCodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * The data used to update LoginCodes.
     */
    data: XOR<LoginCodeUpdateManyMutationInput, LoginCodeUncheckedUpdateManyInput>
    /**
     * Filter which LoginCodes to update
     */
    where?: LoginCodeWhereInput
    /**
     * Limit how many LoginCodes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginCode upsert
   */
  export type LoginCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the LoginCode to update in case it exists.
     */
    where: LoginCodeWhereUniqueInput
    /**
     * In case the LoginCode found by the `where` argument doesn't exist, create a new LoginCode with this data.
     */
    create: XOR<LoginCodeCreateInput, LoginCodeUncheckedCreateInput>
    /**
     * In case the LoginCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoginCodeUpdateInput, LoginCodeUncheckedUpdateInput>
  }

  /**
   * LoginCode delete
   */
  export type LoginCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
    /**
     * Filter which LoginCode to delete.
     */
    where: LoginCodeWhereUniqueInput
  }

  /**
   * LoginCode deleteMany
   */
  export type LoginCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginCodes to delete
     */
    where?: LoginCodeWhereInput
    /**
     * Limit how many LoginCodes to delete.
     */
    limit?: number
  }

  /**
   * LoginCode.user
   */
  export type LoginCode$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ToolUser
     */
    select?: ToolUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ToolUser
     */
    omit?: ToolUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ToolUserInclude<ExtArgs> | null
    where?: ToolUserWhereInput
  }

  /**
   * LoginCode without action
   */
  export type LoginCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginCodeInclude<ExtArgs> | null
  }


  /**
   * Model Analysis
   */

  export type AggregateAnalysis = {
    _count: AnalysisCountAggregateOutputType | null
    _min: AnalysisMinAggregateOutputType | null
    _max: AnalysisMaxAggregateOutputType | null
  }

  export type AnalysisMinAggregateOutputType = {
    id: string | null
    userId: string | null
    fileName: string | null
    formType: string | null
    overallStatus: string | null
    summary: string | null
    rawText: string | null
    aiSource: string | null
    sectionsJson: string | null
    metadataJson: string | null
    createdAt: Date | null
  }

  export type AnalysisMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    fileName: string | null
    formType: string | null
    overallStatus: string | null
    summary: string | null
    rawText: string | null
    aiSource: string | null
    sectionsJson: string | null
    metadataJson: string | null
    createdAt: Date | null
  }

  export type AnalysisCountAggregateOutputType = {
    id: number
    userId: number
    fileName: number
    formType: number
    overallStatus: number
    summary: number
    rawText: number
    aiSource: number
    sectionsJson: number
    metadataJson: number
    createdAt: number
    _all: number
  }


  export type AnalysisMinAggregateInputType = {
    id?: true
    userId?: true
    fileName?: true
    formType?: true
    overallStatus?: true
    summary?: true
    rawText?: true
    aiSource?: true
    sectionsJson?: true
    metadataJson?: true
    createdAt?: true
  }

  export type AnalysisMaxAggregateInputType = {
    id?: true
    userId?: true
    fileName?: true
    formType?: true
    overallStatus?: true
    summary?: true
    rawText?: true
    aiSource?: true
    sectionsJson?: true
    metadataJson?: true
    createdAt?: true
  }

  export type AnalysisCountAggregateInputType = {
    id?: true
    userId?: true
    fileName?: true
    formType?: true
    overallStatus?: true
    summary?: true
    rawText?: true
    aiSource?: true
    sectionsJson?: true
    metadataJson?: true
    createdAt?: true
    _all?: true
  }

  export type AnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analysis to aggregate.
     */
    where?: AnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analyses to fetch.
     */
    orderBy?: AnalysisOrderByWithRelationInput | AnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Analyses
    **/
    _count?: true | AnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysisMaxAggregateInputType
  }

  export type GetAnalysisAggregateType<T extends AnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalysis[P]>
      : GetScalarType<T[P], AggregateAnalysis[P]>
  }




  export type AnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisWhereInput
    orderBy?: AnalysisOrderByWithAggregationInput | AnalysisOrderByWithAggregationInput[]
    by: AnalysisScalarFieldEnum[] | AnalysisScalarFieldEnum
    having?: AnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysisCountAggregateInputType | true
    _min?: AnalysisMinAggregateInputType
    _max?: AnalysisMaxAggregateInputType
  }

  export type AnalysisGroupByOutputType = {
    id: string
    userId: string
    fileName: string
    formType: string
    overallStatus: string
    summary: string
    rawText: string
    aiSource: string
    sectionsJson: string
    metadataJson: string
    createdAt: Date
    _count: AnalysisCountAggregateOutputType | null
    _min: AnalysisMinAggregateOutputType | null
    _max: AnalysisMaxAggregateOutputType | null
  }

  type GetAnalysisGroupByPayload<T extends AnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysisGroupByOutputType[P]>
        }
      >
    >


  export type AnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fileName?: boolean
    formType?: boolean
    overallStatus?: boolean
    summary?: boolean
    rawText?: boolean
    aiSource?: boolean
    sectionsJson?: boolean
    metadataJson?: boolean
    createdAt?: boolean
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
    findings?: boolean | Analysis$findingsArgs<ExtArgs>
    _count?: boolean | AnalysisCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysis"]>

  export type AnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fileName?: boolean
    formType?: boolean
    overallStatus?: boolean
    summary?: boolean
    rawText?: boolean
    aiSource?: boolean
    sectionsJson?: boolean
    metadataJson?: boolean
    createdAt?: boolean
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysis"]>

  export type AnalysisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fileName?: boolean
    formType?: boolean
    overallStatus?: boolean
    summary?: boolean
    rawText?: boolean
    aiSource?: boolean
    sectionsJson?: boolean
    metadataJson?: boolean
    createdAt?: boolean
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysis"]>

  export type AnalysisSelectScalar = {
    id?: boolean
    userId?: boolean
    fileName?: boolean
    formType?: boolean
    overallStatus?: boolean
    summary?: boolean
    rawText?: boolean
    aiSource?: boolean
    sectionsJson?: boolean
    metadataJson?: boolean
    createdAt?: boolean
  }

  export type AnalysisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "fileName" | "formType" | "overallStatus" | "summary" | "rawText" | "aiSource" | "sectionsJson" | "metadataJson" | "createdAt", ExtArgs["result"]["analysis"]>
  export type AnalysisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
    findings?: boolean | Analysis$findingsArgs<ExtArgs>
    _count?: boolean | AnalysisCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AnalysisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }
  export type AnalysisIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | ToolUserDefaultArgs<ExtArgs>
  }

  export type $AnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Analysis"
    objects: {
      user: Prisma.$ToolUserPayload<ExtArgs>
      findings: Prisma.$FindingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      fileName: string
      formType: string
      overallStatus: string
      summary: string
      rawText: string
      aiSource: string
      sectionsJson: string
      metadataJson: string
      createdAt: Date
    }, ExtArgs["result"]["analysis"]>
    composites: {}
  }

  type AnalysisGetPayload<S extends boolean | null | undefined | AnalysisDefaultArgs> = $Result.GetResult<Prisma.$AnalysisPayload, S>

  type AnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalysisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalysisCountAggregateInputType | true
    }

  export interface AnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Analysis'], meta: { name: 'Analysis' } }
    /**
     * Find zero or one Analysis that matches the filter.
     * @param {AnalysisFindUniqueArgs} args - Arguments to find a Analysis
     * @example
     * // Get one Analysis
     * const analysis = await prisma.analysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalysisFindUniqueArgs>(args: SelectSubset<T, AnalysisFindUniqueArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Analysis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalysisFindUniqueOrThrowArgs} args - Arguments to find a Analysis
     * @example
     * // Get one Analysis
     * const analysis = await prisma.analysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisFindFirstArgs} args - Arguments to find a Analysis
     * @example
     * // Get one Analysis
     * const analysis = await prisma.analysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalysisFindFirstArgs>(args?: SelectSubset<T, AnalysisFindFirstArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Analysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisFindFirstOrThrowArgs} args - Arguments to find a Analysis
     * @example
     * // Get one Analysis
     * const analysis = await prisma.analysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Analyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Analyses
     * const analyses = await prisma.analysis.findMany()
     * 
     * // Get first 10 Analyses
     * const analyses = await prisma.analysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysisWithIdOnly = await prisma.analysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalysisFindManyArgs>(args?: SelectSubset<T, AnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Analysis.
     * @param {AnalysisCreateArgs} args - Arguments to create a Analysis.
     * @example
     * // Create one Analysis
     * const Analysis = await prisma.analysis.create({
     *   data: {
     *     // ... data to create a Analysis
     *   }
     * })
     * 
     */
    create<T extends AnalysisCreateArgs>(args: SelectSubset<T, AnalysisCreateArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Analyses.
     * @param {AnalysisCreateManyArgs} args - Arguments to create many Analyses.
     * @example
     * // Create many Analyses
     * const analysis = await prisma.analysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalysisCreateManyArgs>(args?: SelectSubset<T, AnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Analyses and returns the data saved in the database.
     * @param {AnalysisCreateManyAndReturnArgs} args - Arguments to create many Analyses.
     * @example
     * // Create many Analyses
     * const analysis = await prisma.analysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Analyses and only return the `id`
     * const analysisWithIdOnly = await prisma.analysis.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Analysis.
     * @param {AnalysisDeleteArgs} args - Arguments to delete one Analysis.
     * @example
     * // Delete one Analysis
     * const Analysis = await prisma.analysis.delete({
     *   where: {
     *     // ... filter to delete one Analysis
     *   }
     * })
     * 
     */
    delete<T extends AnalysisDeleteArgs>(args: SelectSubset<T, AnalysisDeleteArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Analysis.
     * @param {AnalysisUpdateArgs} args - Arguments to update one Analysis.
     * @example
     * // Update one Analysis
     * const analysis = await prisma.analysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalysisUpdateArgs>(args: SelectSubset<T, AnalysisUpdateArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Analyses.
     * @param {AnalysisDeleteManyArgs} args - Arguments to filter Analyses to delete.
     * @example
     * // Delete a few Analyses
     * const { count } = await prisma.analysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalysisDeleteManyArgs>(args?: SelectSubset<T, AnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Analyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Analyses
     * const analysis = await prisma.analysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalysisUpdateManyArgs>(args: SelectSubset<T, AnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Analyses and returns the data updated in the database.
     * @param {AnalysisUpdateManyAndReturnArgs} args - Arguments to update many Analyses.
     * @example
     * // Update many Analyses
     * const analysis = await prisma.analysis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Analyses and only return the `id`
     * const analysisWithIdOnly = await prisma.analysis.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnalysisUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalysisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Analysis.
     * @param {AnalysisUpsertArgs} args - Arguments to update or create a Analysis.
     * @example
     * // Update or create a Analysis
     * const analysis = await prisma.analysis.upsert({
     *   create: {
     *     // ... data to create a Analysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Analysis we want to update
     *   }
     * })
     */
    upsert<T extends AnalysisUpsertArgs>(args: SelectSubset<T, AnalysisUpsertArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Analyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisCountArgs} args - Arguments to filter Analyses to count.
     * @example
     * // Count the number of Analyses
     * const count = await prisma.analysis.count({
     *   where: {
     *     // ... the filter for the Analyses we want to count
     *   }
     * })
    **/
    count<T extends AnalysisCountArgs>(
      args?: Subset<T, AnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Analysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalysisAggregateArgs>(args: Subset<T, AnalysisAggregateArgs>): Prisma.PrismaPromise<GetAnalysisAggregateType<T>>

    /**
     * Group by Analysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalysisGroupByArgs['orderBy'] }
        : { orderBy?: AnalysisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Analysis model
   */
  readonly fields: AnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Analysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends ToolUserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ToolUserDefaultArgs<ExtArgs>>): Prisma__ToolUserClient<$Result.GetResult<Prisma.$ToolUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    findings<T extends Analysis$findingsArgs<ExtArgs> = {}>(args?: Subset<T, Analysis$findingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Analysis model
   */
  interface AnalysisFieldRefs {
    readonly id: FieldRef<"Analysis", 'String'>
    readonly userId: FieldRef<"Analysis", 'String'>
    readonly fileName: FieldRef<"Analysis", 'String'>
    readonly formType: FieldRef<"Analysis", 'String'>
    readonly overallStatus: FieldRef<"Analysis", 'String'>
    readonly summary: FieldRef<"Analysis", 'String'>
    readonly rawText: FieldRef<"Analysis", 'String'>
    readonly aiSource: FieldRef<"Analysis", 'String'>
    readonly sectionsJson: FieldRef<"Analysis", 'String'>
    readonly metadataJson: FieldRef<"Analysis", 'String'>
    readonly createdAt: FieldRef<"Analysis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Analysis findUnique
   */
  export type AnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    /**
     * Filter, which Analysis to fetch.
     */
    where: AnalysisWhereUniqueInput
  }

  /**
   * Analysis findUniqueOrThrow
   */
  export type AnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    /**
     * Filter, which Analysis to fetch.
     */
    where: AnalysisWhereUniqueInput
  }

  /**
   * Analysis findFirst
   */
  export type AnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    /**
     * Filter, which Analysis to fetch.
     */
    where?: AnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analyses to fetch.
     */
    orderBy?: AnalysisOrderByWithRelationInput | AnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analyses.
     */
    cursor?: AnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analyses.
     */
    distinct?: AnalysisScalarFieldEnum | AnalysisScalarFieldEnum[]
  }

  /**
   * Analysis findFirstOrThrow
   */
  export type AnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    /**
     * Filter, which Analysis to fetch.
     */
    where?: AnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analyses to fetch.
     */
    orderBy?: AnalysisOrderByWithRelationInput | AnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Analyses.
     */
    cursor?: AnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analyses.
     */
    distinct?: AnalysisScalarFieldEnum | AnalysisScalarFieldEnum[]
  }

  /**
   * Analysis findMany
   */
  export type AnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    /**
     * Filter, which Analyses to fetch.
     */
    where?: AnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Analyses to fetch.
     */
    orderBy?: AnalysisOrderByWithRelationInput | AnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Analyses.
     */
    cursor?: AnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Analyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Analyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Analyses.
     */
    distinct?: AnalysisScalarFieldEnum | AnalysisScalarFieldEnum[]
  }

  /**
   * Analysis create
   */
  export type AnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    /**
     * The data needed to create a Analysis.
     */
    data: XOR<AnalysisCreateInput, AnalysisUncheckedCreateInput>
  }

  /**
   * Analysis createMany
   */
  export type AnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Analyses.
     */
    data: AnalysisCreateManyInput | AnalysisCreateManyInput[]
  }

  /**
   * Analysis createManyAndReturn
   */
  export type AnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * The data used to create many Analyses.
     */
    data: AnalysisCreateManyInput | AnalysisCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Analysis update
   */
  export type AnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    /**
     * The data needed to update a Analysis.
     */
    data: XOR<AnalysisUpdateInput, AnalysisUncheckedUpdateInput>
    /**
     * Choose, which Analysis to update.
     */
    where: AnalysisWhereUniqueInput
  }

  /**
   * Analysis updateMany
   */
  export type AnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Analyses.
     */
    data: XOR<AnalysisUpdateManyMutationInput, AnalysisUncheckedUpdateManyInput>
    /**
     * Filter which Analyses to update
     */
    where?: AnalysisWhereInput
    /**
     * Limit how many Analyses to update.
     */
    limit?: number
  }

  /**
   * Analysis updateManyAndReturn
   */
  export type AnalysisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * The data used to update Analyses.
     */
    data: XOR<AnalysisUpdateManyMutationInput, AnalysisUncheckedUpdateManyInput>
    /**
     * Filter which Analyses to update
     */
    where?: AnalysisWhereInput
    /**
     * Limit how many Analyses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Analysis upsert
   */
  export type AnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    /**
     * The filter to search for the Analysis to update in case it exists.
     */
    where: AnalysisWhereUniqueInput
    /**
     * In case the Analysis found by the `where` argument doesn't exist, create a new Analysis with this data.
     */
    create: XOR<AnalysisCreateInput, AnalysisUncheckedCreateInput>
    /**
     * In case the Analysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalysisUpdateInput, AnalysisUncheckedUpdateInput>
  }

  /**
   * Analysis delete
   */
  export type AnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
    /**
     * Filter which Analysis to delete.
     */
    where: AnalysisWhereUniqueInput
  }

  /**
   * Analysis deleteMany
   */
  export type AnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Analyses to delete
     */
    where?: AnalysisWhereInput
    /**
     * Limit how many Analyses to delete.
     */
    limit?: number
  }

  /**
   * Analysis.findings
   */
  export type Analysis$findingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    where?: FindingWhereInput
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    cursor?: FindingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Analysis without action
   */
  export type AnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Analysis
     */
    select?: AnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Analysis
     */
    omit?: AnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisInclude<ExtArgs> | null
  }


  /**
   * Model Finding
   */

  export type AggregateFinding = {
    _count: FindingCountAggregateOutputType | null
    _min: FindingMinAggregateOutputType | null
    _max: FindingMaxAggregateOutputType | null
  }

  export type FindingMinAggregateOutputType = {
    id: string | null
    analysisId: string | null
    section: string | null
    severity: string | null
    title: string | null
    description: string | null
    pageRef: string | null
    lineRef: string | null
    createdAt: Date | null
  }

  export type FindingMaxAggregateOutputType = {
    id: string | null
    analysisId: string | null
    section: string | null
    severity: string | null
    title: string | null
    description: string | null
    pageRef: string | null
    lineRef: string | null
    createdAt: Date | null
  }

  export type FindingCountAggregateOutputType = {
    id: number
    analysisId: number
    section: number
    severity: number
    title: number
    description: number
    pageRef: number
    lineRef: number
    createdAt: number
    _all: number
  }


  export type FindingMinAggregateInputType = {
    id?: true
    analysisId?: true
    section?: true
    severity?: true
    title?: true
    description?: true
    pageRef?: true
    lineRef?: true
    createdAt?: true
  }

  export type FindingMaxAggregateInputType = {
    id?: true
    analysisId?: true
    section?: true
    severity?: true
    title?: true
    description?: true
    pageRef?: true
    lineRef?: true
    createdAt?: true
  }

  export type FindingCountAggregateInputType = {
    id?: true
    analysisId?: true
    section?: true
    severity?: true
    title?: true
    description?: true
    pageRef?: true
    lineRef?: true
    createdAt?: true
    _all?: true
  }

  export type FindingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Finding to aggregate.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Findings
    **/
    _count?: true | FindingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FindingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FindingMaxAggregateInputType
  }

  export type GetFindingAggregateType<T extends FindingAggregateArgs> = {
        [P in keyof T & keyof AggregateFinding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFinding[P]>
      : GetScalarType<T[P], AggregateFinding[P]>
  }




  export type FindingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FindingWhereInput
    orderBy?: FindingOrderByWithAggregationInput | FindingOrderByWithAggregationInput[]
    by: FindingScalarFieldEnum[] | FindingScalarFieldEnum
    having?: FindingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FindingCountAggregateInputType | true
    _min?: FindingMinAggregateInputType
    _max?: FindingMaxAggregateInputType
  }

  export type FindingGroupByOutputType = {
    id: string
    analysisId: string
    section: string
    severity: string
    title: string
    description: string
    pageRef: string | null
    lineRef: string | null
    createdAt: Date
    _count: FindingCountAggregateOutputType | null
    _min: FindingMinAggregateOutputType | null
    _max: FindingMaxAggregateOutputType | null
  }

  type GetFindingGroupByPayload<T extends FindingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FindingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FindingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FindingGroupByOutputType[P]>
            : GetScalarType<T[P], FindingGroupByOutputType[P]>
        }
      >
    >


  export type FindingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    analysisId?: boolean
    section?: boolean
    severity?: boolean
    title?: boolean
    description?: boolean
    pageRef?: boolean
    lineRef?: boolean
    createdAt?: boolean
    analysis?: boolean | AnalysisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["finding"]>

  export type FindingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    analysisId?: boolean
    section?: boolean
    severity?: boolean
    title?: boolean
    description?: boolean
    pageRef?: boolean
    lineRef?: boolean
    createdAt?: boolean
    analysis?: boolean | AnalysisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["finding"]>

  export type FindingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    analysisId?: boolean
    section?: boolean
    severity?: boolean
    title?: boolean
    description?: boolean
    pageRef?: boolean
    lineRef?: boolean
    createdAt?: boolean
    analysis?: boolean | AnalysisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["finding"]>

  export type FindingSelectScalar = {
    id?: boolean
    analysisId?: boolean
    section?: boolean
    severity?: boolean
    title?: boolean
    description?: boolean
    pageRef?: boolean
    lineRef?: boolean
    createdAt?: boolean
  }

  export type FindingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "analysisId" | "section" | "severity" | "title" | "description" | "pageRef" | "lineRef" | "createdAt", ExtArgs["result"]["finding"]>
  export type FindingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analysis?: boolean | AnalysisDefaultArgs<ExtArgs>
  }
  export type FindingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analysis?: boolean | AnalysisDefaultArgs<ExtArgs>
  }
  export type FindingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    analysis?: boolean | AnalysisDefaultArgs<ExtArgs>
  }

  export type $FindingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Finding"
    objects: {
      analysis: Prisma.$AnalysisPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      analysisId: string
      section: string
      severity: string
      title: string
      description: string
      pageRef: string | null
      lineRef: string | null
      createdAt: Date
    }, ExtArgs["result"]["finding"]>
    composites: {}
  }

  type FindingGetPayload<S extends boolean | null | undefined | FindingDefaultArgs> = $Result.GetResult<Prisma.$FindingPayload, S>

  type FindingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FindingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FindingCountAggregateInputType | true
    }

  export interface FindingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Finding'], meta: { name: 'Finding' } }
    /**
     * Find zero or one Finding that matches the filter.
     * @param {FindingFindUniqueArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FindingFindUniqueArgs>(args: SelectSubset<T, FindingFindUniqueArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Finding that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FindingFindUniqueOrThrowArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FindingFindUniqueOrThrowArgs>(args: SelectSubset<T, FindingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Finding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFindFirstArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FindingFindFirstArgs>(args?: SelectSubset<T, FindingFindFirstArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Finding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFindFirstOrThrowArgs} args - Arguments to find a Finding
     * @example
     * // Get one Finding
     * const finding = await prisma.finding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FindingFindFirstOrThrowArgs>(args?: SelectSubset<T, FindingFindFirstOrThrowArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Findings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Findings
     * const findings = await prisma.finding.findMany()
     * 
     * // Get first 10 Findings
     * const findings = await prisma.finding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const findingWithIdOnly = await prisma.finding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FindingFindManyArgs>(args?: SelectSubset<T, FindingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Finding.
     * @param {FindingCreateArgs} args - Arguments to create a Finding.
     * @example
     * // Create one Finding
     * const Finding = await prisma.finding.create({
     *   data: {
     *     // ... data to create a Finding
     *   }
     * })
     * 
     */
    create<T extends FindingCreateArgs>(args: SelectSubset<T, FindingCreateArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Findings.
     * @param {FindingCreateManyArgs} args - Arguments to create many Findings.
     * @example
     * // Create many Findings
     * const finding = await prisma.finding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FindingCreateManyArgs>(args?: SelectSubset<T, FindingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Findings and returns the data saved in the database.
     * @param {FindingCreateManyAndReturnArgs} args - Arguments to create many Findings.
     * @example
     * // Create many Findings
     * const finding = await prisma.finding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Findings and only return the `id`
     * const findingWithIdOnly = await prisma.finding.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FindingCreateManyAndReturnArgs>(args?: SelectSubset<T, FindingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Finding.
     * @param {FindingDeleteArgs} args - Arguments to delete one Finding.
     * @example
     * // Delete one Finding
     * const Finding = await prisma.finding.delete({
     *   where: {
     *     // ... filter to delete one Finding
     *   }
     * })
     * 
     */
    delete<T extends FindingDeleteArgs>(args: SelectSubset<T, FindingDeleteArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Finding.
     * @param {FindingUpdateArgs} args - Arguments to update one Finding.
     * @example
     * // Update one Finding
     * const finding = await prisma.finding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FindingUpdateArgs>(args: SelectSubset<T, FindingUpdateArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Findings.
     * @param {FindingDeleteManyArgs} args - Arguments to filter Findings to delete.
     * @example
     * // Delete a few Findings
     * const { count } = await prisma.finding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FindingDeleteManyArgs>(args?: SelectSubset<T, FindingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Findings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Findings
     * const finding = await prisma.finding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FindingUpdateManyArgs>(args: SelectSubset<T, FindingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Findings and returns the data updated in the database.
     * @param {FindingUpdateManyAndReturnArgs} args - Arguments to update many Findings.
     * @example
     * // Update many Findings
     * const finding = await prisma.finding.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Findings and only return the `id`
     * const findingWithIdOnly = await prisma.finding.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FindingUpdateManyAndReturnArgs>(args: SelectSubset<T, FindingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Finding.
     * @param {FindingUpsertArgs} args - Arguments to update or create a Finding.
     * @example
     * // Update or create a Finding
     * const finding = await prisma.finding.upsert({
     *   create: {
     *     // ... data to create a Finding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Finding we want to update
     *   }
     * })
     */
    upsert<T extends FindingUpsertArgs>(args: SelectSubset<T, FindingUpsertArgs<ExtArgs>>): Prisma__FindingClient<$Result.GetResult<Prisma.$FindingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Findings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingCountArgs} args - Arguments to filter Findings to count.
     * @example
     * // Count the number of Findings
     * const count = await prisma.finding.count({
     *   where: {
     *     // ... the filter for the Findings we want to count
     *   }
     * })
    **/
    count<T extends FindingCountArgs>(
      args?: Subset<T, FindingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FindingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Finding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FindingAggregateArgs>(args: Subset<T, FindingAggregateArgs>): Prisma.PrismaPromise<GetFindingAggregateType<T>>

    /**
     * Group by Finding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FindingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FindingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FindingGroupByArgs['orderBy'] }
        : { orderBy?: FindingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FindingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFindingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Finding model
   */
  readonly fields: FindingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Finding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FindingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    analysis<T extends AnalysisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AnalysisDefaultArgs<ExtArgs>>): Prisma__AnalysisClient<$Result.GetResult<Prisma.$AnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Finding model
   */
  interface FindingFieldRefs {
    readonly id: FieldRef<"Finding", 'String'>
    readonly analysisId: FieldRef<"Finding", 'String'>
    readonly section: FieldRef<"Finding", 'String'>
    readonly severity: FieldRef<"Finding", 'String'>
    readonly title: FieldRef<"Finding", 'String'>
    readonly description: FieldRef<"Finding", 'String'>
    readonly pageRef: FieldRef<"Finding", 'String'>
    readonly lineRef: FieldRef<"Finding", 'String'>
    readonly createdAt: FieldRef<"Finding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Finding findUnique
   */
  export type FindingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding findUniqueOrThrow
   */
  export type FindingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding findFirst
   */
  export type FindingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Findings.
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Findings.
     */
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Finding findFirstOrThrow
   */
  export type FindingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Finding to fetch.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Findings.
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Findings.
     */
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Finding findMany
   */
  export type FindingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter, which Findings to fetch.
     */
    where?: FindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Findings to fetch.
     */
    orderBy?: FindingOrderByWithRelationInput | FindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Findings.
     */
    cursor?: FindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Findings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Findings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Findings.
     */
    distinct?: FindingScalarFieldEnum | FindingScalarFieldEnum[]
  }

  /**
   * Finding create
   */
  export type FindingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * The data needed to create a Finding.
     */
    data: XOR<FindingCreateInput, FindingUncheckedCreateInput>
  }

  /**
   * Finding createMany
   */
  export type FindingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Findings.
     */
    data: FindingCreateManyInput | FindingCreateManyInput[]
  }

  /**
   * Finding createManyAndReturn
   */
  export type FindingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * The data used to create many Findings.
     */
    data: FindingCreateManyInput | FindingCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Finding update
   */
  export type FindingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * The data needed to update a Finding.
     */
    data: XOR<FindingUpdateInput, FindingUncheckedUpdateInput>
    /**
     * Choose, which Finding to update.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding updateMany
   */
  export type FindingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Findings.
     */
    data: XOR<FindingUpdateManyMutationInput, FindingUncheckedUpdateManyInput>
    /**
     * Filter which Findings to update
     */
    where?: FindingWhereInput
    /**
     * Limit how many Findings to update.
     */
    limit?: number
  }

  /**
   * Finding updateManyAndReturn
   */
  export type FindingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * The data used to update Findings.
     */
    data: XOR<FindingUpdateManyMutationInput, FindingUncheckedUpdateManyInput>
    /**
     * Filter which Findings to update
     */
    where?: FindingWhereInput
    /**
     * Limit how many Findings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Finding upsert
   */
  export type FindingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * The filter to search for the Finding to update in case it exists.
     */
    where: FindingWhereUniqueInput
    /**
     * In case the Finding found by the `where` argument doesn't exist, create a new Finding with this data.
     */
    create: XOR<FindingCreateInput, FindingUncheckedCreateInput>
    /**
     * In case the Finding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FindingUpdateInput, FindingUncheckedUpdateInput>
  }

  /**
   * Finding delete
   */
  export type FindingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
    /**
     * Filter which Finding to delete.
     */
    where: FindingWhereUniqueInput
  }

  /**
   * Finding deleteMany
   */
  export type FindingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Findings to delete
     */
    where?: FindingWhereInput
    /**
     * Limit how many Findings to delete.
     */
    limit?: number
  }

  /**
   * Finding without action
   */
  export type FindingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Finding
     */
    select?: FindingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Finding
     */
    omit?: FindingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FindingInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ToolUserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    approved: 'approved',
    isAdmin: 'isAdmin',
    createdAt: 'createdAt'
  };

  export type ToolUserScalarFieldEnum = (typeof ToolUserScalarFieldEnum)[keyof typeof ToolUserScalarFieldEnum]


  export const ToolSessionScalarFieldEnum: {
    id: 'id',
    token: 'token',
    expiresAt: 'expiresAt',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type ToolSessionScalarFieldEnum = (typeof ToolSessionScalarFieldEnum)[keyof typeof ToolSessionScalarFieldEnum]


  export const LoginCodeScalarFieldEnum: {
    id: 'id',
    email: 'email',
    code: 'code',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type LoginCodeScalarFieldEnum = (typeof LoginCodeScalarFieldEnum)[keyof typeof LoginCodeScalarFieldEnum]


  export const AnalysisScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    fileName: 'fileName',
    formType: 'formType',
    overallStatus: 'overallStatus',
    summary: 'summary',
    rawText: 'rawText',
    aiSource: 'aiSource',
    sectionsJson: 'sectionsJson',
    metadataJson: 'metadataJson',
    createdAt: 'createdAt'
  };

  export type AnalysisScalarFieldEnum = (typeof AnalysisScalarFieldEnum)[keyof typeof AnalysisScalarFieldEnum]


  export const FindingScalarFieldEnum: {
    id: 'id',
    analysisId: 'analysisId',
    section: 'section',
    severity: 'severity',
    title: 'title',
    description: 'description',
    pageRef: 'pageRef',
    lineRef: 'lineRef',
    createdAt: 'createdAt'
  };

  export type FindingScalarFieldEnum = (typeof FindingScalarFieldEnum)[keyof typeof FindingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type ToolUserWhereInput = {
    AND?: ToolUserWhereInput | ToolUserWhereInput[]
    OR?: ToolUserWhereInput[]
    NOT?: ToolUserWhereInput | ToolUserWhereInput[]
    id?: StringFilter<"ToolUser"> | string
    email?: StringFilter<"ToolUser"> | string
    approved?: BoolFilter<"ToolUser"> | boolean
    isAdmin?: BoolFilter<"ToolUser"> | boolean
    createdAt?: DateTimeFilter<"ToolUser"> | Date | string
    sessions?: ToolSessionListRelationFilter
    logins?: LoginCodeListRelationFilter
    analyses?: AnalysisListRelationFilter
  }

  export type ToolUserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    approved?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    sessions?: ToolSessionOrderByRelationAggregateInput
    logins?: LoginCodeOrderByRelationAggregateInput
    analyses?: AnalysisOrderByRelationAggregateInput
  }

  export type ToolUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: ToolUserWhereInput | ToolUserWhereInput[]
    OR?: ToolUserWhereInput[]
    NOT?: ToolUserWhereInput | ToolUserWhereInput[]
    approved?: BoolFilter<"ToolUser"> | boolean
    isAdmin?: BoolFilter<"ToolUser"> | boolean
    createdAt?: DateTimeFilter<"ToolUser"> | Date | string
    sessions?: ToolSessionListRelationFilter
    logins?: LoginCodeListRelationFilter
    analyses?: AnalysisListRelationFilter
  }, "id" | "email">

  export type ToolUserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    approved?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    _count?: ToolUserCountOrderByAggregateInput
    _max?: ToolUserMaxOrderByAggregateInput
    _min?: ToolUserMinOrderByAggregateInput
  }

  export type ToolUserScalarWhereWithAggregatesInput = {
    AND?: ToolUserScalarWhereWithAggregatesInput | ToolUserScalarWhereWithAggregatesInput[]
    OR?: ToolUserScalarWhereWithAggregatesInput[]
    NOT?: ToolUserScalarWhereWithAggregatesInput | ToolUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ToolUser"> | string
    email?: StringWithAggregatesFilter<"ToolUser"> | string
    approved?: BoolWithAggregatesFilter<"ToolUser"> | boolean
    isAdmin?: BoolWithAggregatesFilter<"ToolUser"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ToolUser"> | Date | string
  }

  export type ToolSessionWhereInput = {
    AND?: ToolSessionWhereInput | ToolSessionWhereInput[]
    OR?: ToolSessionWhereInput[]
    NOT?: ToolSessionWhereInput | ToolSessionWhereInput[]
    id?: StringFilter<"ToolSession"> | string
    token?: StringFilter<"ToolSession"> | string
    expiresAt?: DateTimeFilter<"ToolSession"> | Date | string
    userId?: StringFilter<"ToolSession"> | string
    createdAt?: DateTimeFilter<"ToolSession"> | Date | string
    user?: XOR<ToolUserScalarRelationFilter, ToolUserWhereInput>
  }

  export type ToolSessionOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    user?: ToolUserOrderByWithRelationInput
  }

  export type ToolSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: ToolSessionWhereInput | ToolSessionWhereInput[]
    OR?: ToolSessionWhereInput[]
    NOT?: ToolSessionWhereInput | ToolSessionWhereInput[]
    expiresAt?: DateTimeFilter<"ToolSession"> | Date | string
    userId?: StringFilter<"ToolSession"> | string
    createdAt?: DateTimeFilter<"ToolSession"> | Date | string
    user?: XOR<ToolUserScalarRelationFilter, ToolUserWhereInput>
  }, "id" | "token">

  export type ToolSessionOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: ToolSessionCountOrderByAggregateInput
    _max?: ToolSessionMaxOrderByAggregateInput
    _min?: ToolSessionMinOrderByAggregateInput
  }

  export type ToolSessionScalarWhereWithAggregatesInput = {
    AND?: ToolSessionScalarWhereWithAggregatesInput | ToolSessionScalarWhereWithAggregatesInput[]
    OR?: ToolSessionScalarWhereWithAggregatesInput[]
    NOT?: ToolSessionScalarWhereWithAggregatesInput | ToolSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ToolSession"> | string
    token?: StringWithAggregatesFilter<"ToolSession"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"ToolSession"> | Date | string
    userId?: StringWithAggregatesFilter<"ToolSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ToolSession"> | Date | string
  }

  export type LoginCodeWhereInput = {
    AND?: LoginCodeWhereInput | LoginCodeWhereInput[]
    OR?: LoginCodeWhereInput[]
    NOT?: LoginCodeWhereInput | LoginCodeWhereInput[]
    id?: StringFilter<"LoginCode"> | string
    email?: StringFilter<"LoginCode"> | string
    code?: StringFilter<"LoginCode"> | string
    expiresAt?: DateTimeFilter<"LoginCode"> | Date | string
    usedAt?: DateTimeNullableFilter<"LoginCode"> | Date | string | null
    userId?: StringNullableFilter<"LoginCode"> | string | null
    createdAt?: DateTimeFilter<"LoginCode"> | Date | string
    user?: XOR<ToolUserNullableScalarRelationFilter, ToolUserWhereInput> | null
  }

  export type LoginCodeOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: ToolUserOrderByWithRelationInput
  }

  export type LoginCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoginCodeWhereInput | LoginCodeWhereInput[]
    OR?: LoginCodeWhereInput[]
    NOT?: LoginCodeWhereInput | LoginCodeWhereInput[]
    email?: StringFilter<"LoginCode"> | string
    code?: StringFilter<"LoginCode"> | string
    expiresAt?: DateTimeFilter<"LoginCode"> | Date | string
    usedAt?: DateTimeNullableFilter<"LoginCode"> | Date | string | null
    userId?: StringNullableFilter<"LoginCode"> | string | null
    createdAt?: DateTimeFilter<"LoginCode"> | Date | string
    user?: XOR<ToolUserNullableScalarRelationFilter, ToolUserWhereInput> | null
  }, "id">

  export type LoginCodeOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LoginCodeCountOrderByAggregateInput
    _max?: LoginCodeMaxOrderByAggregateInput
    _min?: LoginCodeMinOrderByAggregateInput
  }

  export type LoginCodeScalarWhereWithAggregatesInput = {
    AND?: LoginCodeScalarWhereWithAggregatesInput | LoginCodeScalarWhereWithAggregatesInput[]
    OR?: LoginCodeScalarWhereWithAggregatesInput[]
    NOT?: LoginCodeScalarWhereWithAggregatesInput | LoginCodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoginCode"> | string
    email?: StringWithAggregatesFilter<"LoginCode"> | string
    code?: StringWithAggregatesFilter<"LoginCode"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"LoginCode"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"LoginCode"> | Date | string | null
    userId?: StringNullableWithAggregatesFilter<"LoginCode"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LoginCode"> | Date | string
  }

  export type AnalysisWhereInput = {
    AND?: AnalysisWhereInput | AnalysisWhereInput[]
    OR?: AnalysisWhereInput[]
    NOT?: AnalysisWhereInput | AnalysisWhereInput[]
    id?: StringFilter<"Analysis"> | string
    userId?: StringFilter<"Analysis"> | string
    fileName?: StringFilter<"Analysis"> | string
    formType?: StringFilter<"Analysis"> | string
    overallStatus?: StringFilter<"Analysis"> | string
    summary?: StringFilter<"Analysis"> | string
    rawText?: StringFilter<"Analysis"> | string
    aiSource?: StringFilter<"Analysis"> | string
    sectionsJson?: StringFilter<"Analysis"> | string
    metadataJson?: StringFilter<"Analysis"> | string
    createdAt?: DateTimeFilter<"Analysis"> | Date | string
    user?: XOR<ToolUserScalarRelationFilter, ToolUserWhereInput>
    findings?: FindingListRelationFilter
  }

  export type AnalysisOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    formType?: SortOrder
    overallStatus?: SortOrder
    summary?: SortOrder
    rawText?: SortOrder
    aiSource?: SortOrder
    sectionsJson?: SortOrder
    metadataJson?: SortOrder
    createdAt?: SortOrder
    user?: ToolUserOrderByWithRelationInput
    findings?: FindingOrderByRelationAggregateInput
  }

  export type AnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnalysisWhereInput | AnalysisWhereInput[]
    OR?: AnalysisWhereInput[]
    NOT?: AnalysisWhereInput | AnalysisWhereInput[]
    userId?: StringFilter<"Analysis"> | string
    fileName?: StringFilter<"Analysis"> | string
    formType?: StringFilter<"Analysis"> | string
    overallStatus?: StringFilter<"Analysis"> | string
    summary?: StringFilter<"Analysis"> | string
    rawText?: StringFilter<"Analysis"> | string
    aiSource?: StringFilter<"Analysis"> | string
    sectionsJson?: StringFilter<"Analysis"> | string
    metadataJson?: StringFilter<"Analysis"> | string
    createdAt?: DateTimeFilter<"Analysis"> | Date | string
    user?: XOR<ToolUserScalarRelationFilter, ToolUserWhereInput>
    findings?: FindingListRelationFilter
  }, "id">

  export type AnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    formType?: SortOrder
    overallStatus?: SortOrder
    summary?: SortOrder
    rawText?: SortOrder
    aiSource?: SortOrder
    sectionsJson?: SortOrder
    metadataJson?: SortOrder
    createdAt?: SortOrder
    _count?: AnalysisCountOrderByAggregateInput
    _max?: AnalysisMaxOrderByAggregateInput
    _min?: AnalysisMinOrderByAggregateInput
  }

  export type AnalysisScalarWhereWithAggregatesInput = {
    AND?: AnalysisScalarWhereWithAggregatesInput | AnalysisScalarWhereWithAggregatesInput[]
    OR?: AnalysisScalarWhereWithAggregatesInput[]
    NOT?: AnalysisScalarWhereWithAggregatesInput | AnalysisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Analysis"> | string
    userId?: StringWithAggregatesFilter<"Analysis"> | string
    fileName?: StringWithAggregatesFilter<"Analysis"> | string
    formType?: StringWithAggregatesFilter<"Analysis"> | string
    overallStatus?: StringWithAggregatesFilter<"Analysis"> | string
    summary?: StringWithAggregatesFilter<"Analysis"> | string
    rawText?: StringWithAggregatesFilter<"Analysis"> | string
    aiSource?: StringWithAggregatesFilter<"Analysis"> | string
    sectionsJson?: StringWithAggregatesFilter<"Analysis"> | string
    metadataJson?: StringWithAggregatesFilter<"Analysis"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Analysis"> | Date | string
  }

  export type FindingWhereInput = {
    AND?: FindingWhereInput | FindingWhereInput[]
    OR?: FindingWhereInput[]
    NOT?: FindingWhereInput | FindingWhereInput[]
    id?: StringFilter<"Finding"> | string
    analysisId?: StringFilter<"Finding"> | string
    section?: StringFilter<"Finding"> | string
    severity?: StringFilter<"Finding"> | string
    title?: StringFilter<"Finding"> | string
    description?: StringFilter<"Finding"> | string
    pageRef?: StringNullableFilter<"Finding"> | string | null
    lineRef?: StringNullableFilter<"Finding"> | string | null
    createdAt?: DateTimeFilter<"Finding"> | Date | string
    analysis?: XOR<AnalysisScalarRelationFilter, AnalysisWhereInput>
  }

  export type FindingOrderByWithRelationInput = {
    id?: SortOrder
    analysisId?: SortOrder
    section?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    pageRef?: SortOrderInput | SortOrder
    lineRef?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    analysis?: AnalysisOrderByWithRelationInput
  }

  export type FindingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FindingWhereInput | FindingWhereInput[]
    OR?: FindingWhereInput[]
    NOT?: FindingWhereInput | FindingWhereInput[]
    analysisId?: StringFilter<"Finding"> | string
    section?: StringFilter<"Finding"> | string
    severity?: StringFilter<"Finding"> | string
    title?: StringFilter<"Finding"> | string
    description?: StringFilter<"Finding"> | string
    pageRef?: StringNullableFilter<"Finding"> | string | null
    lineRef?: StringNullableFilter<"Finding"> | string | null
    createdAt?: DateTimeFilter<"Finding"> | Date | string
    analysis?: XOR<AnalysisScalarRelationFilter, AnalysisWhereInput>
  }, "id">

  export type FindingOrderByWithAggregationInput = {
    id?: SortOrder
    analysisId?: SortOrder
    section?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    pageRef?: SortOrderInput | SortOrder
    lineRef?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: FindingCountOrderByAggregateInput
    _max?: FindingMaxOrderByAggregateInput
    _min?: FindingMinOrderByAggregateInput
  }

  export type FindingScalarWhereWithAggregatesInput = {
    AND?: FindingScalarWhereWithAggregatesInput | FindingScalarWhereWithAggregatesInput[]
    OR?: FindingScalarWhereWithAggregatesInput[]
    NOT?: FindingScalarWhereWithAggregatesInput | FindingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Finding"> | string
    analysisId?: StringWithAggregatesFilter<"Finding"> | string
    section?: StringWithAggregatesFilter<"Finding"> | string
    severity?: StringWithAggregatesFilter<"Finding"> | string
    title?: StringWithAggregatesFilter<"Finding"> | string
    description?: StringWithAggregatesFilter<"Finding"> | string
    pageRef?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    lineRef?: StringNullableWithAggregatesFilter<"Finding"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Finding"> | Date | string
  }

  export type ToolUserCreateInput = {
    id?: string
    email: string
    approved?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    sessions?: ToolSessionCreateNestedManyWithoutUserInput
    logins?: LoginCodeCreateNestedManyWithoutUserInput
    analyses?: AnalysisCreateNestedManyWithoutUserInput
  }

  export type ToolUserUncheckedCreateInput = {
    id?: string
    email: string
    approved?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    sessions?: ToolSessionUncheckedCreateNestedManyWithoutUserInput
    logins?: LoginCodeUncheckedCreateNestedManyWithoutUserInput
    analyses?: AnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type ToolUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ToolSessionUpdateManyWithoutUserNestedInput
    logins?: LoginCodeUpdateManyWithoutUserNestedInput
    analyses?: AnalysisUpdateManyWithoutUserNestedInput
  }

  export type ToolUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ToolSessionUncheckedUpdateManyWithoutUserNestedInput
    logins?: LoginCodeUncheckedUpdateManyWithoutUserNestedInput
    analyses?: AnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ToolUserCreateManyInput = {
    id?: string
    email: string
    approved?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
  }

  export type ToolUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolSessionCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    user: ToolUserCreateNestedOneWithoutSessionsInput
  }

  export type ToolSessionUncheckedCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    userId: string
    createdAt?: Date | string
  }

  export type ToolSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ToolUserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type ToolSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolSessionCreateManyInput = {
    id?: string
    token: string
    expiresAt: Date | string
    userId: string
    createdAt?: Date | string
  }

  export type ToolSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeCreateInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    user?: ToolUserCreateNestedOneWithoutLoginsInput
  }

  export type LoginCodeUncheckedCreateInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    userId?: string | null
    createdAt?: Date | string
  }

  export type LoginCodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ToolUserUpdateOneWithoutLoginsNestedInput
  }

  export type LoginCodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeCreateManyInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    userId?: string | null
    createdAt?: Date | string
  }

  export type LoginCodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisCreateInput = {
    id?: string
    fileName: string
    formType: string
    overallStatus: string
    summary: string
    rawText: string
    aiSource: string
    sectionsJson: string
    metadataJson: string
    createdAt?: Date | string
    user: ToolUserCreateNestedOneWithoutAnalysesInput
    findings?: FindingCreateNestedManyWithoutAnalysisInput
  }

  export type AnalysisUncheckedCreateInput = {
    id?: string
    userId: string
    fileName: string
    formType: string
    overallStatus: string
    summary: string
    rawText: string
    aiSource: string
    sectionsJson: string
    metadataJson: string
    createdAt?: Date | string
    findings?: FindingUncheckedCreateNestedManyWithoutAnalysisInput
  }

  export type AnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    formType?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    rawText?: StringFieldUpdateOperationsInput | string
    aiSource?: StringFieldUpdateOperationsInput | string
    sectionsJson?: StringFieldUpdateOperationsInput | string
    metadataJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ToolUserUpdateOneRequiredWithoutAnalysesNestedInput
    findings?: FindingUpdateManyWithoutAnalysisNestedInput
  }

  export type AnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    formType?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    rawText?: StringFieldUpdateOperationsInput | string
    aiSource?: StringFieldUpdateOperationsInput | string
    sectionsJson?: StringFieldUpdateOperationsInput | string
    metadataJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    findings?: FindingUncheckedUpdateManyWithoutAnalysisNestedInput
  }

  export type AnalysisCreateManyInput = {
    id?: string
    userId: string
    fileName: string
    formType: string
    overallStatus: string
    summary: string
    rawText: string
    aiSource: string
    sectionsJson: string
    metadataJson: string
    createdAt?: Date | string
  }

  export type AnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    formType?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    rawText?: StringFieldUpdateOperationsInput | string
    aiSource?: StringFieldUpdateOperationsInput | string
    sectionsJson?: StringFieldUpdateOperationsInput | string
    metadataJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    formType?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    rawText?: StringFieldUpdateOperationsInput | string
    aiSource?: StringFieldUpdateOperationsInput | string
    sectionsJson?: StringFieldUpdateOperationsInput | string
    metadataJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingCreateInput = {
    id?: string
    section: string
    severity: string
    title: string
    description: string
    pageRef?: string | null
    lineRef?: string | null
    createdAt?: Date | string
    analysis: AnalysisCreateNestedOneWithoutFindingsInput
  }

  export type FindingUncheckedCreateInput = {
    id?: string
    analysisId: string
    section: string
    severity: string
    title: string
    description: string
    pageRef?: string | null
    lineRef?: string | null
    createdAt?: Date | string
  }

  export type FindingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pageRef?: NullableStringFieldUpdateOperationsInput | string | null
    lineRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    analysis?: AnalysisUpdateOneRequiredWithoutFindingsNestedInput
  }

  export type FindingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    analysisId?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pageRef?: NullableStringFieldUpdateOperationsInput | string | null
    lineRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingCreateManyInput = {
    id?: string
    analysisId: string
    section: string
    severity: string
    title: string
    description: string
    pageRef?: string | null
    lineRef?: string | null
    createdAt?: Date | string
  }

  export type FindingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pageRef?: NullableStringFieldUpdateOperationsInput | string | null
    lineRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    analysisId?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pageRef?: NullableStringFieldUpdateOperationsInput | string | null
    lineRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ToolSessionListRelationFilter = {
    every?: ToolSessionWhereInput
    some?: ToolSessionWhereInput
    none?: ToolSessionWhereInput
  }

  export type LoginCodeListRelationFilter = {
    every?: LoginCodeWhereInput
    some?: LoginCodeWhereInput
    none?: LoginCodeWhereInput
  }

  export type AnalysisListRelationFilter = {
    every?: AnalysisWhereInput
    some?: AnalysisWhereInput
    none?: AnalysisWhereInput
  }

  export type ToolSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LoginCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnalysisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ToolUserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    approved?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
  }

  export type ToolUserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    approved?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
  }

  export type ToolUserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    approved?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ToolUserScalarRelationFilter = {
    is?: ToolUserWhereInput
    isNot?: ToolUserWhereInput
  }

  export type ToolSessionCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type ToolSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type ToolSessionMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type ToolUserNullableScalarRelationFilter = {
    is?: ToolUserWhereInput | null
    isNot?: ToolUserWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LoginCodeCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginCodeMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FindingListRelationFilter = {
    every?: FindingWhereInput
    some?: FindingWhereInput
    none?: FindingWhereInput
  }

  export type FindingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    formType?: SortOrder
    overallStatus?: SortOrder
    summary?: SortOrder
    rawText?: SortOrder
    aiSource?: SortOrder
    sectionsJson?: SortOrder
    metadataJson?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    formType?: SortOrder
    overallStatus?: SortOrder
    summary?: SortOrder
    rawText?: SortOrder
    aiSource?: SortOrder
    sectionsJson?: SortOrder
    metadataJson?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fileName?: SortOrder
    formType?: SortOrder
    overallStatus?: SortOrder
    summary?: SortOrder
    rawText?: SortOrder
    aiSource?: SortOrder
    sectionsJson?: SortOrder
    metadataJson?: SortOrder
    createdAt?: SortOrder
  }

  export type AnalysisScalarRelationFilter = {
    is?: AnalysisWhereInput
    isNot?: AnalysisWhereInput
  }

  export type FindingCountOrderByAggregateInput = {
    id?: SortOrder
    analysisId?: SortOrder
    section?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    pageRef?: SortOrder
    lineRef?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingMaxOrderByAggregateInput = {
    id?: SortOrder
    analysisId?: SortOrder
    section?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    pageRef?: SortOrder
    lineRef?: SortOrder
    createdAt?: SortOrder
  }

  export type FindingMinOrderByAggregateInput = {
    id?: SortOrder
    analysisId?: SortOrder
    section?: SortOrder
    severity?: SortOrder
    title?: SortOrder
    description?: SortOrder
    pageRef?: SortOrder
    lineRef?: SortOrder
    createdAt?: SortOrder
  }

  export type ToolSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<ToolSessionCreateWithoutUserInput, ToolSessionUncheckedCreateWithoutUserInput> | ToolSessionCreateWithoutUserInput[] | ToolSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ToolSessionCreateOrConnectWithoutUserInput | ToolSessionCreateOrConnectWithoutUserInput[]
    createMany?: ToolSessionCreateManyUserInputEnvelope
    connect?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
  }

  export type LoginCodeCreateNestedManyWithoutUserInput = {
    create?: XOR<LoginCodeCreateWithoutUserInput, LoginCodeUncheckedCreateWithoutUserInput> | LoginCodeCreateWithoutUserInput[] | LoginCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginCodeCreateOrConnectWithoutUserInput | LoginCodeCreateOrConnectWithoutUserInput[]
    createMany?: LoginCodeCreateManyUserInputEnvelope
    connect?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
  }

  export type AnalysisCreateNestedManyWithoutUserInput = {
    create?: XOR<AnalysisCreateWithoutUserInput, AnalysisUncheckedCreateWithoutUserInput> | AnalysisCreateWithoutUserInput[] | AnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalysisCreateOrConnectWithoutUserInput | AnalysisCreateOrConnectWithoutUserInput[]
    createMany?: AnalysisCreateManyUserInputEnvelope
    connect?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
  }

  export type ToolSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ToolSessionCreateWithoutUserInput, ToolSessionUncheckedCreateWithoutUserInput> | ToolSessionCreateWithoutUserInput[] | ToolSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ToolSessionCreateOrConnectWithoutUserInput | ToolSessionCreateOrConnectWithoutUserInput[]
    createMany?: ToolSessionCreateManyUserInputEnvelope
    connect?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
  }

  export type LoginCodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LoginCodeCreateWithoutUserInput, LoginCodeUncheckedCreateWithoutUserInput> | LoginCodeCreateWithoutUserInput[] | LoginCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginCodeCreateOrConnectWithoutUserInput | LoginCodeCreateOrConnectWithoutUserInput[]
    createMany?: LoginCodeCreateManyUserInputEnvelope
    connect?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
  }

  export type AnalysisUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AnalysisCreateWithoutUserInput, AnalysisUncheckedCreateWithoutUserInput> | AnalysisCreateWithoutUserInput[] | AnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalysisCreateOrConnectWithoutUserInput | AnalysisCreateOrConnectWithoutUserInput[]
    createMany?: AnalysisCreateManyUserInputEnvelope
    connect?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ToolSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ToolSessionCreateWithoutUserInput, ToolSessionUncheckedCreateWithoutUserInput> | ToolSessionCreateWithoutUserInput[] | ToolSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ToolSessionCreateOrConnectWithoutUserInput | ToolSessionCreateOrConnectWithoutUserInput[]
    upsert?: ToolSessionUpsertWithWhereUniqueWithoutUserInput | ToolSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ToolSessionCreateManyUserInputEnvelope
    set?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
    disconnect?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
    delete?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
    connect?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
    update?: ToolSessionUpdateWithWhereUniqueWithoutUserInput | ToolSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ToolSessionUpdateManyWithWhereWithoutUserInput | ToolSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ToolSessionScalarWhereInput | ToolSessionScalarWhereInput[]
  }

  export type LoginCodeUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoginCodeCreateWithoutUserInput, LoginCodeUncheckedCreateWithoutUserInput> | LoginCodeCreateWithoutUserInput[] | LoginCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginCodeCreateOrConnectWithoutUserInput | LoginCodeCreateOrConnectWithoutUserInput[]
    upsert?: LoginCodeUpsertWithWhereUniqueWithoutUserInput | LoginCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoginCodeCreateManyUserInputEnvelope
    set?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
    disconnect?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
    delete?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
    connect?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
    update?: LoginCodeUpdateWithWhereUniqueWithoutUserInput | LoginCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoginCodeUpdateManyWithWhereWithoutUserInput | LoginCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoginCodeScalarWhereInput | LoginCodeScalarWhereInput[]
  }

  export type AnalysisUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnalysisCreateWithoutUserInput, AnalysisUncheckedCreateWithoutUserInput> | AnalysisCreateWithoutUserInput[] | AnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalysisCreateOrConnectWithoutUserInput | AnalysisCreateOrConnectWithoutUserInput[]
    upsert?: AnalysisUpsertWithWhereUniqueWithoutUserInput | AnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnalysisCreateManyUserInputEnvelope
    set?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
    disconnect?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
    delete?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
    connect?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
    update?: AnalysisUpdateWithWhereUniqueWithoutUserInput | AnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnalysisUpdateManyWithWhereWithoutUserInput | AnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnalysisScalarWhereInput | AnalysisScalarWhereInput[]
  }

  export type ToolSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ToolSessionCreateWithoutUserInput, ToolSessionUncheckedCreateWithoutUserInput> | ToolSessionCreateWithoutUserInput[] | ToolSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ToolSessionCreateOrConnectWithoutUserInput | ToolSessionCreateOrConnectWithoutUserInput[]
    upsert?: ToolSessionUpsertWithWhereUniqueWithoutUserInput | ToolSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ToolSessionCreateManyUserInputEnvelope
    set?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
    disconnect?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
    delete?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
    connect?: ToolSessionWhereUniqueInput | ToolSessionWhereUniqueInput[]
    update?: ToolSessionUpdateWithWhereUniqueWithoutUserInput | ToolSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ToolSessionUpdateManyWithWhereWithoutUserInput | ToolSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ToolSessionScalarWhereInput | ToolSessionScalarWhereInput[]
  }

  export type LoginCodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoginCodeCreateWithoutUserInput, LoginCodeUncheckedCreateWithoutUserInput> | LoginCodeCreateWithoutUserInput[] | LoginCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginCodeCreateOrConnectWithoutUserInput | LoginCodeCreateOrConnectWithoutUserInput[]
    upsert?: LoginCodeUpsertWithWhereUniqueWithoutUserInput | LoginCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoginCodeCreateManyUserInputEnvelope
    set?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
    disconnect?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
    delete?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
    connect?: LoginCodeWhereUniqueInput | LoginCodeWhereUniqueInput[]
    update?: LoginCodeUpdateWithWhereUniqueWithoutUserInput | LoginCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoginCodeUpdateManyWithWhereWithoutUserInput | LoginCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoginCodeScalarWhereInput | LoginCodeScalarWhereInput[]
  }

  export type AnalysisUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnalysisCreateWithoutUserInput, AnalysisUncheckedCreateWithoutUserInput> | AnalysisCreateWithoutUserInput[] | AnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalysisCreateOrConnectWithoutUserInput | AnalysisCreateOrConnectWithoutUserInput[]
    upsert?: AnalysisUpsertWithWhereUniqueWithoutUserInput | AnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnalysisCreateManyUserInputEnvelope
    set?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
    disconnect?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
    delete?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
    connect?: AnalysisWhereUniqueInput | AnalysisWhereUniqueInput[]
    update?: AnalysisUpdateWithWhereUniqueWithoutUserInput | AnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnalysisUpdateManyWithWhereWithoutUserInput | AnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnalysisScalarWhereInput | AnalysisScalarWhereInput[]
  }

  export type ToolUserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<ToolUserCreateWithoutSessionsInput, ToolUserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ToolUserCreateOrConnectWithoutSessionsInput
    connect?: ToolUserWhereUniqueInput
  }

  export type ToolUserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<ToolUserCreateWithoutSessionsInput, ToolUserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ToolUserCreateOrConnectWithoutSessionsInput
    upsert?: ToolUserUpsertWithoutSessionsInput
    connect?: ToolUserWhereUniqueInput
    update?: XOR<XOR<ToolUserUpdateToOneWithWhereWithoutSessionsInput, ToolUserUpdateWithoutSessionsInput>, ToolUserUncheckedUpdateWithoutSessionsInput>
  }

  export type ToolUserCreateNestedOneWithoutLoginsInput = {
    create?: XOR<ToolUserCreateWithoutLoginsInput, ToolUserUncheckedCreateWithoutLoginsInput>
    connectOrCreate?: ToolUserCreateOrConnectWithoutLoginsInput
    connect?: ToolUserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ToolUserUpdateOneWithoutLoginsNestedInput = {
    create?: XOR<ToolUserCreateWithoutLoginsInput, ToolUserUncheckedCreateWithoutLoginsInput>
    connectOrCreate?: ToolUserCreateOrConnectWithoutLoginsInput
    upsert?: ToolUserUpsertWithoutLoginsInput
    disconnect?: ToolUserWhereInput | boolean
    delete?: ToolUserWhereInput | boolean
    connect?: ToolUserWhereUniqueInput
    update?: XOR<XOR<ToolUserUpdateToOneWithWhereWithoutLoginsInput, ToolUserUpdateWithoutLoginsInput>, ToolUserUncheckedUpdateWithoutLoginsInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ToolUserCreateNestedOneWithoutAnalysesInput = {
    create?: XOR<ToolUserCreateWithoutAnalysesInput, ToolUserUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: ToolUserCreateOrConnectWithoutAnalysesInput
    connect?: ToolUserWhereUniqueInput
  }

  export type FindingCreateNestedManyWithoutAnalysisInput = {
    create?: XOR<FindingCreateWithoutAnalysisInput, FindingUncheckedCreateWithoutAnalysisInput> | FindingCreateWithoutAnalysisInput[] | FindingUncheckedCreateWithoutAnalysisInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutAnalysisInput | FindingCreateOrConnectWithoutAnalysisInput[]
    createMany?: FindingCreateManyAnalysisInputEnvelope
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
  }

  export type FindingUncheckedCreateNestedManyWithoutAnalysisInput = {
    create?: XOR<FindingCreateWithoutAnalysisInput, FindingUncheckedCreateWithoutAnalysisInput> | FindingCreateWithoutAnalysisInput[] | FindingUncheckedCreateWithoutAnalysisInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutAnalysisInput | FindingCreateOrConnectWithoutAnalysisInput[]
    createMany?: FindingCreateManyAnalysisInputEnvelope
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
  }

  export type ToolUserUpdateOneRequiredWithoutAnalysesNestedInput = {
    create?: XOR<ToolUserCreateWithoutAnalysesInput, ToolUserUncheckedCreateWithoutAnalysesInput>
    connectOrCreate?: ToolUserCreateOrConnectWithoutAnalysesInput
    upsert?: ToolUserUpsertWithoutAnalysesInput
    connect?: ToolUserWhereUniqueInput
    update?: XOR<XOR<ToolUserUpdateToOneWithWhereWithoutAnalysesInput, ToolUserUpdateWithoutAnalysesInput>, ToolUserUncheckedUpdateWithoutAnalysesInput>
  }

  export type FindingUpdateManyWithoutAnalysisNestedInput = {
    create?: XOR<FindingCreateWithoutAnalysisInput, FindingUncheckedCreateWithoutAnalysisInput> | FindingCreateWithoutAnalysisInput[] | FindingUncheckedCreateWithoutAnalysisInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutAnalysisInput | FindingCreateOrConnectWithoutAnalysisInput[]
    upsert?: FindingUpsertWithWhereUniqueWithoutAnalysisInput | FindingUpsertWithWhereUniqueWithoutAnalysisInput[]
    createMany?: FindingCreateManyAnalysisInputEnvelope
    set?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    disconnect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    delete?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    update?: FindingUpdateWithWhereUniqueWithoutAnalysisInput | FindingUpdateWithWhereUniqueWithoutAnalysisInput[]
    updateMany?: FindingUpdateManyWithWhereWithoutAnalysisInput | FindingUpdateManyWithWhereWithoutAnalysisInput[]
    deleteMany?: FindingScalarWhereInput | FindingScalarWhereInput[]
  }

  export type FindingUncheckedUpdateManyWithoutAnalysisNestedInput = {
    create?: XOR<FindingCreateWithoutAnalysisInput, FindingUncheckedCreateWithoutAnalysisInput> | FindingCreateWithoutAnalysisInput[] | FindingUncheckedCreateWithoutAnalysisInput[]
    connectOrCreate?: FindingCreateOrConnectWithoutAnalysisInput | FindingCreateOrConnectWithoutAnalysisInput[]
    upsert?: FindingUpsertWithWhereUniqueWithoutAnalysisInput | FindingUpsertWithWhereUniqueWithoutAnalysisInput[]
    createMany?: FindingCreateManyAnalysisInputEnvelope
    set?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    disconnect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    delete?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    connect?: FindingWhereUniqueInput | FindingWhereUniqueInput[]
    update?: FindingUpdateWithWhereUniqueWithoutAnalysisInput | FindingUpdateWithWhereUniqueWithoutAnalysisInput[]
    updateMany?: FindingUpdateManyWithWhereWithoutAnalysisInput | FindingUpdateManyWithWhereWithoutAnalysisInput[]
    deleteMany?: FindingScalarWhereInput | FindingScalarWhereInput[]
  }

  export type AnalysisCreateNestedOneWithoutFindingsInput = {
    create?: XOR<AnalysisCreateWithoutFindingsInput, AnalysisUncheckedCreateWithoutFindingsInput>
    connectOrCreate?: AnalysisCreateOrConnectWithoutFindingsInput
    connect?: AnalysisWhereUniqueInput
  }

  export type AnalysisUpdateOneRequiredWithoutFindingsNestedInput = {
    create?: XOR<AnalysisCreateWithoutFindingsInput, AnalysisUncheckedCreateWithoutFindingsInput>
    connectOrCreate?: AnalysisCreateOrConnectWithoutFindingsInput
    upsert?: AnalysisUpsertWithoutFindingsInput
    connect?: AnalysisWhereUniqueInput
    update?: XOR<XOR<AnalysisUpdateToOneWithWhereWithoutFindingsInput, AnalysisUpdateWithoutFindingsInput>, AnalysisUncheckedUpdateWithoutFindingsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ToolSessionCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type ToolSessionUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type ToolSessionCreateOrConnectWithoutUserInput = {
    where: ToolSessionWhereUniqueInput
    create: XOR<ToolSessionCreateWithoutUserInput, ToolSessionUncheckedCreateWithoutUserInput>
  }

  export type ToolSessionCreateManyUserInputEnvelope = {
    data: ToolSessionCreateManyUserInput | ToolSessionCreateManyUserInput[]
  }

  export type LoginCodeCreateWithoutUserInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LoginCodeUncheckedCreateWithoutUserInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LoginCodeCreateOrConnectWithoutUserInput = {
    where: LoginCodeWhereUniqueInput
    create: XOR<LoginCodeCreateWithoutUserInput, LoginCodeUncheckedCreateWithoutUserInput>
  }

  export type LoginCodeCreateManyUserInputEnvelope = {
    data: LoginCodeCreateManyUserInput | LoginCodeCreateManyUserInput[]
  }

  export type AnalysisCreateWithoutUserInput = {
    id?: string
    fileName: string
    formType: string
    overallStatus: string
    summary: string
    rawText: string
    aiSource: string
    sectionsJson: string
    metadataJson: string
    createdAt?: Date | string
    findings?: FindingCreateNestedManyWithoutAnalysisInput
  }

  export type AnalysisUncheckedCreateWithoutUserInput = {
    id?: string
    fileName: string
    formType: string
    overallStatus: string
    summary: string
    rawText: string
    aiSource: string
    sectionsJson: string
    metadataJson: string
    createdAt?: Date | string
    findings?: FindingUncheckedCreateNestedManyWithoutAnalysisInput
  }

  export type AnalysisCreateOrConnectWithoutUserInput = {
    where: AnalysisWhereUniqueInput
    create: XOR<AnalysisCreateWithoutUserInput, AnalysisUncheckedCreateWithoutUserInput>
  }

  export type AnalysisCreateManyUserInputEnvelope = {
    data: AnalysisCreateManyUserInput | AnalysisCreateManyUserInput[]
  }

  export type ToolSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: ToolSessionWhereUniqueInput
    update: XOR<ToolSessionUpdateWithoutUserInput, ToolSessionUncheckedUpdateWithoutUserInput>
    create: XOR<ToolSessionCreateWithoutUserInput, ToolSessionUncheckedCreateWithoutUserInput>
  }

  export type ToolSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: ToolSessionWhereUniqueInput
    data: XOR<ToolSessionUpdateWithoutUserInput, ToolSessionUncheckedUpdateWithoutUserInput>
  }

  export type ToolSessionUpdateManyWithWhereWithoutUserInput = {
    where: ToolSessionScalarWhereInput
    data: XOR<ToolSessionUpdateManyMutationInput, ToolSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type ToolSessionScalarWhereInput = {
    AND?: ToolSessionScalarWhereInput | ToolSessionScalarWhereInput[]
    OR?: ToolSessionScalarWhereInput[]
    NOT?: ToolSessionScalarWhereInput | ToolSessionScalarWhereInput[]
    id?: StringFilter<"ToolSession"> | string
    token?: StringFilter<"ToolSession"> | string
    expiresAt?: DateTimeFilter<"ToolSession"> | Date | string
    userId?: StringFilter<"ToolSession"> | string
    createdAt?: DateTimeFilter<"ToolSession"> | Date | string
  }

  export type LoginCodeUpsertWithWhereUniqueWithoutUserInput = {
    where: LoginCodeWhereUniqueInput
    update: XOR<LoginCodeUpdateWithoutUserInput, LoginCodeUncheckedUpdateWithoutUserInput>
    create: XOR<LoginCodeCreateWithoutUserInput, LoginCodeUncheckedCreateWithoutUserInput>
  }

  export type LoginCodeUpdateWithWhereUniqueWithoutUserInput = {
    where: LoginCodeWhereUniqueInput
    data: XOR<LoginCodeUpdateWithoutUserInput, LoginCodeUncheckedUpdateWithoutUserInput>
  }

  export type LoginCodeUpdateManyWithWhereWithoutUserInput = {
    where: LoginCodeScalarWhereInput
    data: XOR<LoginCodeUpdateManyMutationInput, LoginCodeUncheckedUpdateManyWithoutUserInput>
  }

  export type LoginCodeScalarWhereInput = {
    AND?: LoginCodeScalarWhereInput | LoginCodeScalarWhereInput[]
    OR?: LoginCodeScalarWhereInput[]
    NOT?: LoginCodeScalarWhereInput | LoginCodeScalarWhereInput[]
    id?: StringFilter<"LoginCode"> | string
    email?: StringFilter<"LoginCode"> | string
    code?: StringFilter<"LoginCode"> | string
    expiresAt?: DateTimeFilter<"LoginCode"> | Date | string
    usedAt?: DateTimeNullableFilter<"LoginCode"> | Date | string | null
    userId?: StringNullableFilter<"LoginCode"> | string | null
    createdAt?: DateTimeFilter<"LoginCode"> | Date | string
  }

  export type AnalysisUpsertWithWhereUniqueWithoutUserInput = {
    where: AnalysisWhereUniqueInput
    update: XOR<AnalysisUpdateWithoutUserInput, AnalysisUncheckedUpdateWithoutUserInput>
    create: XOR<AnalysisCreateWithoutUserInput, AnalysisUncheckedCreateWithoutUserInput>
  }

  export type AnalysisUpdateWithWhereUniqueWithoutUserInput = {
    where: AnalysisWhereUniqueInput
    data: XOR<AnalysisUpdateWithoutUserInput, AnalysisUncheckedUpdateWithoutUserInput>
  }

  export type AnalysisUpdateManyWithWhereWithoutUserInput = {
    where: AnalysisScalarWhereInput
    data: XOR<AnalysisUpdateManyMutationInput, AnalysisUncheckedUpdateManyWithoutUserInput>
  }

  export type AnalysisScalarWhereInput = {
    AND?: AnalysisScalarWhereInput | AnalysisScalarWhereInput[]
    OR?: AnalysisScalarWhereInput[]
    NOT?: AnalysisScalarWhereInput | AnalysisScalarWhereInput[]
    id?: StringFilter<"Analysis"> | string
    userId?: StringFilter<"Analysis"> | string
    fileName?: StringFilter<"Analysis"> | string
    formType?: StringFilter<"Analysis"> | string
    overallStatus?: StringFilter<"Analysis"> | string
    summary?: StringFilter<"Analysis"> | string
    rawText?: StringFilter<"Analysis"> | string
    aiSource?: StringFilter<"Analysis"> | string
    sectionsJson?: StringFilter<"Analysis"> | string
    metadataJson?: StringFilter<"Analysis"> | string
    createdAt?: DateTimeFilter<"Analysis"> | Date | string
  }

  export type ToolUserCreateWithoutSessionsInput = {
    id?: string
    email: string
    approved?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    logins?: LoginCodeCreateNestedManyWithoutUserInput
    analyses?: AnalysisCreateNestedManyWithoutUserInput
  }

  export type ToolUserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    approved?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    logins?: LoginCodeUncheckedCreateNestedManyWithoutUserInput
    analyses?: AnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type ToolUserCreateOrConnectWithoutSessionsInput = {
    where: ToolUserWhereUniqueInput
    create: XOR<ToolUserCreateWithoutSessionsInput, ToolUserUncheckedCreateWithoutSessionsInput>
  }

  export type ToolUserUpsertWithoutSessionsInput = {
    update: XOR<ToolUserUpdateWithoutSessionsInput, ToolUserUncheckedUpdateWithoutSessionsInput>
    create: XOR<ToolUserCreateWithoutSessionsInput, ToolUserUncheckedCreateWithoutSessionsInput>
    where?: ToolUserWhereInput
  }

  export type ToolUserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: ToolUserWhereInput
    data: XOR<ToolUserUpdateWithoutSessionsInput, ToolUserUncheckedUpdateWithoutSessionsInput>
  }

  export type ToolUserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logins?: LoginCodeUpdateManyWithoutUserNestedInput
    analyses?: AnalysisUpdateManyWithoutUserNestedInput
  }

  export type ToolUserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logins?: LoginCodeUncheckedUpdateManyWithoutUserNestedInput
    analyses?: AnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ToolUserCreateWithoutLoginsInput = {
    id?: string
    email: string
    approved?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    sessions?: ToolSessionCreateNestedManyWithoutUserInput
    analyses?: AnalysisCreateNestedManyWithoutUserInput
  }

  export type ToolUserUncheckedCreateWithoutLoginsInput = {
    id?: string
    email: string
    approved?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    sessions?: ToolSessionUncheckedCreateNestedManyWithoutUserInput
    analyses?: AnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type ToolUserCreateOrConnectWithoutLoginsInput = {
    where: ToolUserWhereUniqueInput
    create: XOR<ToolUserCreateWithoutLoginsInput, ToolUserUncheckedCreateWithoutLoginsInput>
  }

  export type ToolUserUpsertWithoutLoginsInput = {
    update: XOR<ToolUserUpdateWithoutLoginsInput, ToolUserUncheckedUpdateWithoutLoginsInput>
    create: XOR<ToolUserCreateWithoutLoginsInput, ToolUserUncheckedCreateWithoutLoginsInput>
    where?: ToolUserWhereInput
  }

  export type ToolUserUpdateToOneWithWhereWithoutLoginsInput = {
    where?: ToolUserWhereInput
    data: XOR<ToolUserUpdateWithoutLoginsInput, ToolUserUncheckedUpdateWithoutLoginsInput>
  }

  export type ToolUserUpdateWithoutLoginsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ToolSessionUpdateManyWithoutUserNestedInput
    analyses?: AnalysisUpdateManyWithoutUserNestedInput
  }

  export type ToolUserUncheckedUpdateWithoutLoginsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ToolSessionUncheckedUpdateManyWithoutUserNestedInput
    analyses?: AnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ToolUserCreateWithoutAnalysesInput = {
    id?: string
    email: string
    approved?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    sessions?: ToolSessionCreateNestedManyWithoutUserInput
    logins?: LoginCodeCreateNestedManyWithoutUserInput
  }

  export type ToolUserUncheckedCreateWithoutAnalysesInput = {
    id?: string
    email: string
    approved?: boolean
    isAdmin?: boolean
    createdAt?: Date | string
    sessions?: ToolSessionUncheckedCreateNestedManyWithoutUserInput
    logins?: LoginCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type ToolUserCreateOrConnectWithoutAnalysesInput = {
    where: ToolUserWhereUniqueInput
    create: XOR<ToolUserCreateWithoutAnalysesInput, ToolUserUncheckedCreateWithoutAnalysesInput>
  }

  export type FindingCreateWithoutAnalysisInput = {
    id?: string
    section: string
    severity: string
    title: string
    description: string
    pageRef?: string | null
    lineRef?: string | null
    createdAt?: Date | string
  }

  export type FindingUncheckedCreateWithoutAnalysisInput = {
    id?: string
    section: string
    severity: string
    title: string
    description: string
    pageRef?: string | null
    lineRef?: string | null
    createdAt?: Date | string
  }

  export type FindingCreateOrConnectWithoutAnalysisInput = {
    where: FindingWhereUniqueInput
    create: XOR<FindingCreateWithoutAnalysisInput, FindingUncheckedCreateWithoutAnalysisInput>
  }

  export type FindingCreateManyAnalysisInputEnvelope = {
    data: FindingCreateManyAnalysisInput | FindingCreateManyAnalysisInput[]
  }

  export type ToolUserUpsertWithoutAnalysesInput = {
    update: XOR<ToolUserUpdateWithoutAnalysesInput, ToolUserUncheckedUpdateWithoutAnalysesInput>
    create: XOR<ToolUserCreateWithoutAnalysesInput, ToolUserUncheckedCreateWithoutAnalysesInput>
    where?: ToolUserWhereInput
  }

  export type ToolUserUpdateToOneWithWhereWithoutAnalysesInput = {
    where?: ToolUserWhereInput
    data: XOR<ToolUserUpdateWithoutAnalysesInput, ToolUserUncheckedUpdateWithoutAnalysesInput>
  }

  export type ToolUserUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ToolSessionUpdateManyWithoutUserNestedInput
    logins?: LoginCodeUpdateManyWithoutUserNestedInput
  }

  export type ToolUserUncheckedUpdateWithoutAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    approved?: BoolFieldUpdateOperationsInput | boolean
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ToolSessionUncheckedUpdateManyWithoutUserNestedInput
    logins?: LoginCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type FindingUpsertWithWhereUniqueWithoutAnalysisInput = {
    where: FindingWhereUniqueInput
    update: XOR<FindingUpdateWithoutAnalysisInput, FindingUncheckedUpdateWithoutAnalysisInput>
    create: XOR<FindingCreateWithoutAnalysisInput, FindingUncheckedCreateWithoutAnalysisInput>
  }

  export type FindingUpdateWithWhereUniqueWithoutAnalysisInput = {
    where: FindingWhereUniqueInput
    data: XOR<FindingUpdateWithoutAnalysisInput, FindingUncheckedUpdateWithoutAnalysisInput>
  }

  export type FindingUpdateManyWithWhereWithoutAnalysisInput = {
    where: FindingScalarWhereInput
    data: XOR<FindingUpdateManyMutationInput, FindingUncheckedUpdateManyWithoutAnalysisInput>
  }

  export type FindingScalarWhereInput = {
    AND?: FindingScalarWhereInput | FindingScalarWhereInput[]
    OR?: FindingScalarWhereInput[]
    NOT?: FindingScalarWhereInput | FindingScalarWhereInput[]
    id?: StringFilter<"Finding"> | string
    analysisId?: StringFilter<"Finding"> | string
    section?: StringFilter<"Finding"> | string
    severity?: StringFilter<"Finding"> | string
    title?: StringFilter<"Finding"> | string
    description?: StringFilter<"Finding"> | string
    pageRef?: StringNullableFilter<"Finding"> | string | null
    lineRef?: StringNullableFilter<"Finding"> | string | null
    createdAt?: DateTimeFilter<"Finding"> | Date | string
  }

  export type AnalysisCreateWithoutFindingsInput = {
    id?: string
    fileName: string
    formType: string
    overallStatus: string
    summary: string
    rawText: string
    aiSource: string
    sectionsJson: string
    metadataJson: string
    createdAt?: Date | string
    user: ToolUserCreateNestedOneWithoutAnalysesInput
  }

  export type AnalysisUncheckedCreateWithoutFindingsInput = {
    id?: string
    userId: string
    fileName: string
    formType: string
    overallStatus: string
    summary: string
    rawText: string
    aiSource: string
    sectionsJson: string
    metadataJson: string
    createdAt?: Date | string
  }

  export type AnalysisCreateOrConnectWithoutFindingsInput = {
    where: AnalysisWhereUniqueInput
    create: XOR<AnalysisCreateWithoutFindingsInput, AnalysisUncheckedCreateWithoutFindingsInput>
  }

  export type AnalysisUpsertWithoutFindingsInput = {
    update: XOR<AnalysisUpdateWithoutFindingsInput, AnalysisUncheckedUpdateWithoutFindingsInput>
    create: XOR<AnalysisCreateWithoutFindingsInput, AnalysisUncheckedCreateWithoutFindingsInput>
    where?: AnalysisWhereInput
  }

  export type AnalysisUpdateToOneWithWhereWithoutFindingsInput = {
    where?: AnalysisWhereInput
    data: XOR<AnalysisUpdateWithoutFindingsInput, AnalysisUncheckedUpdateWithoutFindingsInput>
  }

  export type AnalysisUpdateWithoutFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    formType?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    rawText?: StringFieldUpdateOperationsInput | string
    aiSource?: StringFieldUpdateOperationsInput | string
    sectionsJson?: StringFieldUpdateOperationsInput | string
    metadataJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: ToolUserUpdateOneRequiredWithoutAnalysesNestedInput
  }

  export type AnalysisUncheckedUpdateWithoutFindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    formType?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    rawText?: StringFieldUpdateOperationsInput | string
    aiSource?: StringFieldUpdateOperationsInput | string
    sectionsJson?: StringFieldUpdateOperationsInput | string
    metadataJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolSessionCreateManyUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type LoginCodeCreateManyUserInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AnalysisCreateManyUserInput = {
    id?: string
    fileName: string
    formType: string
    overallStatus: string
    summary: string
    rawText: string
    aiSource: string
    sectionsJson: string
    metadataJson: string
    createdAt?: Date | string
  }

  export type ToolSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ToolSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    formType?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    rawText?: StringFieldUpdateOperationsInput | string
    aiSource?: StringFieldUpdateOperationsInput | string
    sectionsJson?: StringFieldUpdateOperationsInput | string
    metadataJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    findings?: FindingUpdateManyWithoutAnalysisNestedInput
  }

  export type AnalysisUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    formType?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    rawText?: StringFieldUpdateOperationsInput | string
    aiSource?: StringFieldUpdateOperationsInput | string
    sectionsJson?: StringFieldUpdateOperationsInput | string
    metadataJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    findings?: FindingUncheckedUpdateManyWithoutAnalysisNestedInput
  }

  export type AnalysisUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    formType?: StringFieldUpdateOperationsInput | string
    overallStatus?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    rawText?: StringFieldUpdateOperationsInput | string
    aiSource?: StringFieldUpdateOperationsInput | string
    sectionsJson?: StringFieldUpdateOperationsInput | string
    metadataJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingCreateManyAnalysisInput = {
    id?: string
    section: string
    severity: string
    title: string
    description: string
    pageRef?: string | null
    lineRef?: string | null
    createdAt?: Date | string
  }

  export type FindingUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pageRef?: NullableStringFieldUpdateOperationsInput | string | null
    lineRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingUncheckedUpdateWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pageRef?: NullableStringFieldUpdateOperationsInput | string | null
    lineRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FindingUncheckedUpdateManyWithoutAnalysisInput = {
    id?: StringFieldUpdateOperationsInput | string
    section?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pageRef?: NullableStringFieldUpdateOperationsInput | string | null
    lineRef?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}