import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'titlecase'
})

export class TitleCasePipe implements PipeTransform {
  transform(word: string) {
    if (word.toLocaleUpperCase() == word.toLocaleUpperCase()) return word;
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}
