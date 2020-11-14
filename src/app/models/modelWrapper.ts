export class ModelWrapper<T = any> {

  public value: T;
  public selected: boolean = false;

  public constructor(object: T) {
    this.value = object;
  }

  public static wrapArray<AT>(inputArray: Array<AT>): Array<ModelWrapper<AT>> {
    if (!inputArray) {
      inputArray = [];
    }
    return inputArray.map(i => {
      return new ModelWrapper<AT>(i)
    });
  }
}
