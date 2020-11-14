import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'underscoreToSpace'
})

export class UnderscoreToSpacePipe implements PipeTransform {
  transform(word: string) {
    if (!word) return;
    return word.replace(/_/g, ' ');
  }
}
