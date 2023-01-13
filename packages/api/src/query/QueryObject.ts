// Wzorzec: Query Object
export abstract class QueryObject<T> {
  abstract readonly type: string

  abstract execute(): Promise<T>
}
