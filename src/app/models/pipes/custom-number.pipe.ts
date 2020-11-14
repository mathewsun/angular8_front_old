import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'customNumber'
})
export class CustomNumberPipe implements PipeTransform {

  transform(val: number): any {
    if (val == 0) return 0;
    if (!val) return undefined;
    let str = val.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2});
    str = str.replace(/\./, '.');
    str = str.replace(/,/g, '&nbsp;');
    return str;
  }

}
