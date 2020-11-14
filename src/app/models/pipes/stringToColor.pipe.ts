import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'stringToColorPipe'
})
export class StringToColorPipe implements PipeTransform {
  transform(input: string, saturation: number, value: number) {
    return 'hsl(' + this.calcHash(input) + ', ' + saturation + '%, ' + value + '%)';
  }

  private calcHash(str): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) % 2 == 0)
        hash = str.charCodeAt(i) * 31 + (hash);
      else
        hash = str.charCodeAt(i) * 12 + (hash);

      if (hash > Number.MAX_SAFE_INTEGER / 2)
        hash /= 2;
    }
    return (hash * str.length) % 360;

  }
}
