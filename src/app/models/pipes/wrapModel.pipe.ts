import {Pipe, PipeTransform} from '@angular/core';
import {ModelWrapper} from "../modelWrapper";

@Pipe({
  name: 'wrapModel'
})
export class WrapModelPipe implements PipeTransform {

  transform(input: any) {
    return new ModelWrapper(input);
  }

}

@Pipe({
  name: 'wrapModelArray'
})
export class WrapModelArrayPipe implements PipeTransform {

  transform(input: any[]): ModelWrapper[] {
    return ModelWrapper.wrapArray(input);
  }

}
